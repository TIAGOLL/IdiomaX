import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { CreateClassFormSchema } from '@idiomax/validation-schemas/class/create-class';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { createClass } from '@/services/class';

type CreateClassRequest = z.infer<typeof CreateClassFormSchema>;

export function CreateClassPage() {
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateClassRequest) => {
            const response = await createClass(data);
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(CreateClassFormSchema) as Resolver<CreateClassRequest>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            company_id: getCurrentCompanyId(),
            name: '',
            vacancies: 1,
            course_id: ''
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
                        <select id="course_id" {...register('course_id')} className="w-full border rounded px-2 py-1">
                            <option value="">Selecione um curso</option>
                            {loadingCourses ? (
                                <option disabled>Carregando...</option>
                            ) : (
                                courses?.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))
                            )}
                        </select>
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
