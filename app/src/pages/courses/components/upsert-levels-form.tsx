import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, LoaderIcon, GraduationCap, Trash2, Edit2, Power, PowerOff } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import type { DeactivateLevelFormData } from '@idiomax/http-schemas/levels/deactivate-level';
import { CreateLevelFormSchema } from '@idiomax/http-schemas/levels/create-level';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createLevel, getLevels, updateLevel, deactivateLevel, deleteLevel } from '@/services/levels';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useSessionContext } from '@/contexts/session-context';
import type { Level } from '@idiomax/http-schemas/levels/get-levels';

type CreateLevelRequest = z.infer<typeof CreateLevelFormSchema>;

type Course = {
    id: string;
    name: string;
    description: string | null;
    registration_value: number;
    workload: number;
    monthly_fee_value: number;
    minimum_grade: number;
    maximum_grade: number;
    minimum_frequency: number;
    syllabus: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
};

interface UpsertLevelsProps {
    course: Course;
}

export function UpsertLevels({ course }: UpsertLevelsProps) {
    const [editingLevel, setEditingLevel] = useState<Level | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const queryClient = useQueryClient();
    const { getCompanyId } = useSessionContext();
    const courseId = course.id;

    // Query para buscar levels do curso
    const { data: levels = [], isLoading: isLoadingLevels } = useQuery({
        queryKey: ['levels', courseId],
        queryFn: () => getLevels({ course_id: courseId }),
        enabled: !!courseId,
    });

    // Mutation para criar level
    const { mutate: createLevelMutation, isPending: isCreating } = useMutation({
        mutationFn: async (data: CreateLevelRequest) => {
            const companyId = getCompanyId();
            if (!companyId) {
                throw new Error('Company ID não encontrado');
            }

            const response = await createLevel({
                company_id: companyId,
                course_id: courseId,
                name: data.name,
                level: data.level,
                disciplines: data.disciplines
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setIsCreateDialogOpen(false);
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao criar level');
        }
    });

    // Mutation para atualizar level
    const { mutate: updateLevelMutation, isPending: isUpdating } = useMutation({
        mutationFn: async (data: { id: string; levelData: CreateLevelRequest }) => {
            const companyId = getCompanyId();
            if (!companyId) {
                throw new Error('Company ID não encontrado');
            }

            const response = await updateLevel(data.id, {
                id: data.id,
                company_id: companyId,
                name: data.levelData.name,
                level: data.levelData.level,
                disciplines: data.levelData.disciplines.map(d => ({ name: d.name }))
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setIsEditDialogOpen(false);
            setEditingLevel(null);
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao atualizar level');
        }
    });

    // Mutation para ativar/desativar level
    const { mutate: toggleLevelStatus, isPending: isToggling } = useMutation({
        mutationFn: async (data: { id: string; active: boolean }) => {
            const levelData: DeactivateLevelFormData = { active: data.active };
            const response = await deactivateLevel(data.id, levelData);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao alterar status do level');
        }
    });

    // Mutation para deletar level
    const { mutate: deleteLevelMutation, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            const response = await deleteLevel(id);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setDeleteTarget(null);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao deletar level');
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue
    } = useForm<CreateLevelRequest>({
        resolver: zodResolver(CreateLevelFormSchema) as Resolver<CreateLevelRequest>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            courses_id: '',
            name: '',
            level: 1,
            disciplines: []
        }
    });

    const { fields: disciplineFields, append: appendDiscipline, remove: removeDiscipline } = useFieldArray({
        control,
        name: "disciplines"
    });

    const handleCreateLevel = (data: CreateLevelRequest) => {
        createLevelMutation({ ...data, courses_id: courseId });
    };

    const handleUpdateLevel = (data: CreateLevelRequest) => {
        if (editingLevel) {
            updateLevelMutation({ id: editingLevel.id, levelData: { ...data, courses_id: courseId } });
        }
    };

    const handleEditLevel = (level: Level) => {
        setEditingLevel(level);
        setValue('name', level.name);
        setValue('level', level.level);
        setValue('disciplines', level.disciplines.map(d => ({ name: d.name })));
        setIsEditDialogOpen(true);
    };

    const handleAddDiscipline = () => {
        appendDiscipline({ name: '' });
    };

    const handleDeleteLevel = (level: Level) => {
        setDeleteTarget({ id: level.id, name: level.name });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            deleteLevelMutation(deleteTarget.id);
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header com botão de criar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="size-5" />
                        Níveis e Disciplinas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os níveis e disciplinas do curso: {course.name}
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="size-4 mr-2" />
                            Novo Nível
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Nível</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(handleCreateLevel)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do Nível *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Básico I, Intermediário II"
                                        {...register('name')}
                                    />
                                    <FormMessageError error={errors.name?.message} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Ordem do Nível *</Label>
                                    <Input
                                        id="level"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        {...register('level', { valueAsNumber: true })}
                                    />
                                    <FormMessageError error={errors.level?.message} />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold">Disciplinas</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddDiscipline}
                                    >
                                        <PlusCircle className="size-4 mr-2" />
                                        Adicionar Disciplina
                                    </Button>
                                </div>

                                {disciplineFields.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        Nenhuma disciplina adicionada. Clique em "Adicionar Disciplina" para começar.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {disciplineFields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder={`Nome da disciplina ${index + 1}`}
                                                        {...register(`disciplines.${index}.name`)}
                                                    />
                                                    <FormMessageError error={errors.disciplines?.[index]?.name?.message} />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeDiscipline(index)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <LoaderIcon className="size-4 mr-2 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="size-4 mr-2" />
                                            Criar Nível
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Lista de Níveis */}
            {isLoadingLevels ? (
                <div className="flex justify-center py-8">
                    <LoaderIcon className="size-8 animate-spin" />
                </div>
            ) : levels.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                    Nenhum nível encontrado para este curso. Crie o primeiro nível clicando em "Novo Nível".
                </p>
            ) : (
                <div className="space-y-4">
                    {levels.map((level: Level) => (
                        <Card key={level.id} className="border-l-4 border-l-primary">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg">{level.name}</h3>
                                            <Badge variant={level.active ? "default" : "secondary"}>
                                                Nível {level.level} - {level.active ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </div>

                                        {level.disciplines && level.disciplines.length > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">Disciplinas:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {level.disciplines.map((discipline) => (
                                                        <Badge
                                                            key={discipline.id}
                                                            variant={discipline.active ? "outline" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {discipline.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Nenhuma disciplina cadastrada</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditLevel(level)}
                                        >
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleLevelStatus({ id: level.id, active: !level.active })}
                                            disabled={isToggling}
                                        >
                                            {level.active ? (
                                                <PowerOff className="size-4" />
                                            ) : (
                                                <Power className="size-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteLevel(level)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog de Edição */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Nível</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleUpdateLevel)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome do Nível *</Label>
                                <Input
                                    id="edit-name"
                                    placeholder="Ex: Básico I, Intermediário II"
                                    {...register('name')}
                                />
                                <FormMessageError error={errors.name?.message} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-level">Ordem do Nível *</Label>
                                <Input
                                    id="edit-level"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    {...register('level', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.level?.message} />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Disciplinas</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddDiscipline}
                                >
                                    <PlusCircle className="size-4 mr-2" />
                                    Adicionar Disciplina
                                </Button>
                            </div>

                            {disciplineFields.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    Nenhuma disciplina adicionada.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {disciplineFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder={`Nome da disciplina ${index + 1}`}
                                                    {...register(`disciplines.${index}.name`)}
                                                />
                                                <FormMessageError error={errors.disciplines?.[index]?.name?.message} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeDiscipline(index)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setEditingLevel(null);
                                    reset();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <LoaderIcon className="size-4 mr-2 animate-spin" />
                                        Atualizando...
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="size-4 mr-2" />
                                        Atualizar Nível
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog de Confirmação de Exclusão */}
            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza de que deseja excluir o nível "{deleteTarget?.name}"?
                            Esta ação não pode ser desfeita e todas as disciplinas associadas também serão removidas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}