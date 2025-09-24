import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { createDiscipline, type CreateDisciplineRequest } from '@/services/disciplines';
import { toast } from 'sonner';

interface CreateDisciplineFormProps {
    levelId: string;
    levelName: string;
    courseId: string;
}

export function CreateDisciplineForm({ levelId, levelName, courseId }: CreateDisciplineFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [disciplineName, setDisciplineName] = useState('');

    const queryClient = useQueryClient();

    const { mutate: handleCreateDiscipline, isPending } = useMutation({
        mutationFn: (data: CreateDisciplineRequest) => createDiscipline(data),
        onSuccess: () => {
            toast.success('Disciplina criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setDisciplineName('');
            setIsOpen(false);
        },
        onError: () => {
            toast.error('Erro ao criar disciplina');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disciplineName.trim()) {
            toast.error('Nome da disciplina é obrigatório');
            return;
        }

        handleCreateDiscipline({
            name: disciplineName.trim(),
            level_id: levelId,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 text-xs">
                    <Plus className="size-3 mr-1" />
                    Adicionar Disciplina
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Disciplina</DialogTitle>
                    <DialogDescription>
                        Adicionar nova disciplina ao nível "{levelName}"
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="disciplineName" className="text-right">
                                Nome
                            </Label>
                            <Input
                                id="disciplineName"
                                value={disciplineName}
                                onChange={(e) => setDisciplineName(e.target.value)}
                                className="col-span-3"
                                placeholder="Digite o nome da disciplina..."
                                disabled={isPending}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending || !disciplineName.trim()}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Criar Disciplina
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}