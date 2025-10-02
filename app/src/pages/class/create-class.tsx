import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, LoaderIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateClassFormSchema } from '@idiomax/validation-schemas/class/create-class';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { createClass } from '@/services/class/create-class';
import { getCourses } from '@/services/courses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CreateClassRequest = z.infer<typeof CreateClassFormSchema>;

export function CreateClassPage() {
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateClassRequest) => {
            const response = await createClass({
                company_id: getCurrentCompanyId(),
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourses({ company_id: getCurrentCompanyId() }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(CreateClassFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: '',
            vacancies: 1,
            course_id: '',
        }
    });

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                    <PlusCircle className="w-5 h-5" />
                    Criar Turma
                </CardTitle>
                <CardDescription>Preencha os dados para cadastrar uma nova turma.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome da turma</Label>
                        <Input id="name" {...register('name')} autoFocus />
                        <FormMessageError error={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="vacancies">Vagas</Label>
                        <Input id="vacancies" type="number" min={1} {...register('vacancies', { valueAsNumber: true })} />
                        <FormMessageError error={errors.vacancies} />
                    </div>
                    <div>
                        <Label htmlFor="course_id">Curso</Label>
                        <Controller
                            name="course_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value?.toString()}
                                    onValueChange={(value) => field.onChange(value === "true")}
                                    defaultValue={field.value?.toString()}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            courses?.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormMessageError error={errors.course_id} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <LoaderIcon className="w-4 h-4 animate-spin" /> : 'Criar turma'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
