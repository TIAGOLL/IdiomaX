import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, LoaderIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { type GetClassByIdResponseType, EditClassFormSchema } from '@idiomax/validation-schemas/class';
import { editClass } from '@/services/class/edit-class';
import { removeClassDay } from '@/services/class/remove-class-day';


type EditClassFormType = z.infer<typeof EditClassFormSchema>;

const WEEK_DAYS = [
    { id: 'SEGUNDA', label: 'Segunda-feira' },
    { id: 'TERCA', label: 'Terça-feira' },
    { id: 'QUARTA', label: 'Quarta-feira' },
    { id: 'QUINTA', label: 'Quinta-feira' },
    { id: 'SEXTA', label: 'Sexta-feira' },
    { id: 'SABADO', label: 'Sábado' },
    { id: 'DOMINGO', label: 'Domingo' },
];



export function EditClassForm({ class: classData }: { class: GetClassByIdResponseType }) {
    const queryClient = useQueryClient();

    // Mutation para remover dia da semana imediatamente
    const { mutate: removeDay, isPending: isRemoving } = useMutation({
        mutationFn: async (classDayId: string) => {
            const response = await removeClassDay({
                class_day_id: classDayId,
                company_id: getCurrentCompanyId()
            });
            return { response, classDayId };
        },
        onSuccess: ({ response, classDayId }) => {
            toast.success(response.message);
            // Remover do formulário imediatamente
            const currentClassDays = watch('class_days') || [];
            const updatedClassDays = currentClassDays.filter(day => day.id !== classDayId);
            setValue('class_days', updatedClassDays);
            // Invalidar queries para manter sincronização
            queryClient.invalidateQueries({ queryKey: ['class', classData.id] });
            queryClient.invalidateQueries({ queryKey: ['classes', getCurrentCompanyId()] });
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });



    const { mutate, isPending } = useMutation({
        mutationFn: async (data: EditClassFormType) => {
            const response = await editClass({
                company_id: getCurrentCompanyId(),
                id: classData.id,
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['class', classData.id] });
            queryClient.invalidateQueries({ queryKey: ['classes', getCurrentCompanyId()] });
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,

        watch,
        setValue,
        formState: { errors }
    } = useForm<EditClassFormType>({
        resolver: zodResolver(EditClassFormSchema),
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            name: classData.name,
            vacancies: classData.vacancies,
            class_days: classData.class_days?.map(day => ({
                id: day.id,
                week_date: day.week_date,
                start_time: new Date(day.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }),
                end_time: new Date(day.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
            })) || []
        }
    });

    // Watch class_days para reatividade
    const classDays = watch('class_days') || [];

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
            <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                {/* Nome da Turma */}
                <div className="col-span-2 space-y-1">
                    <Label htmlFor='name'>Nome da Turma *</Label>
                    <Input
                        type='text'
                        id='name'
                        {...register('name')}
                    />
                    <FormMessageError error={errors.name?.message} />
                </div>

                {/* Vagas da turma */}
                <div className="col-span-1 space-y-1">
                    <Label htmlFor='vacancies'>Vagas da turma *</Label>
                    <Input
                        type='number'
                        id='vacancies'
                        placeholder="30"
                        {...register('vacancies', { valueAsNumber: true })}
                    />
                    <FormMessageError error={errors.vacancies?.message} />
                </div>
            </div>

            <Separator className='my-6' />

            {/* Dias da semana e horários */}
            <div className='space-y-3'>
                <div className="flex items-center justify-between">
                    <Label>Dias da semana e horários</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const currentDays = watch('class_days') || [];
                            setValue('class_days', [...currentDays, { week_date: 'SEGUNDA', start_time: '', end_time: '' }]);
                        }}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Adicionar Horário
                    </Button>
                </div>

                {/* Mostrar erros de validação dos horários */}
                {errors.class_days && (
                    <FormMessageError
                        error={typeof errors.class_days.message === 'string'
                            ? errors.class_days.message
                            : 'Verifique os horários informados'
                        }
                    />
                )}

                {classDays.length > 0 ? (
                    <div className="space-y-3">
                        {classDays.map((classDay, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-md">
                                <div className="col-span-4">
                                    <Select
                                        value={classDay.week_date}
                                        onValueChange={(value: 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO') => {
                                            const currentDays = [...classDays];
                                            currentDays[index].week_date = value;
                                            setValue('class_days', currentDays);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WEEK_DAYS.map((day) => (
                                                <SelectItem key={day.id} value={day.id}>
                                                    {day.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        type="time"
                                        value={classDay.start_time}
                                        onChange={(e) => {
                                            const currentDays = [...classDays];
                                            currentDays[index].start_time = e.target.value;
                                            setValue('class_days', currentDays);
                                        }}
                                    />
                                </div>
                                <div className="col-span-1 text-center text-sm text-muted-foreground">
                                    às
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        type="time"
                                        value={classDay.end_time}
                                        onChange={(e) => {
                                            const currentDays = [...classDays];
                                            currentDays[index].end_time = e.target.value;
                                            setValue('class_days', currentDays);
                                        }}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        disabled={isRemoving}
                                        onClick={() => {
                                            if (classDay.id) {
                                                // Se tem ID, remove do banco imediatamente
                                                removeDay(classDay.id);
                                            } else {
                                                // Se não tem ID, remove apenas localmente (item novo)
                                                const currentDays = classDays.filter((_, i) => i !== index);
                                                setValue('class_days', currentDays);
                                            }
                                        }}
                                    >
                                        {isRemoving ? (
                                            <LoaderIcon className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        Nenhum horário definido ainda.
                        <br />
                        <span className="text-sm">Clique em "Adicionar Horário" para começar.</span>
                    </div>
                )}
            </div>

            <div className='flex justify-end pt-4'>
                <Button
                    variant='default'
                    type='submit'
                    disabled={isPending}
                >
                    Salvar Alterações
                    {isPending ? (
                        <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                    ) : (
                        <Save className='ml-2 h-4 w-4' />
                    )}
                </Button>
            </div>
        </form>
    );
}