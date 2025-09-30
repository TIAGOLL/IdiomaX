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
import { BookmarkPlus, Loader2 } from 'lucide-react';
import { createDiscipline } from '@/services/disciplines';
import type { CreateDisciplineFormSchema } from '@idiomax/validation-schemas/disciplines/create-discipline';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getCurrentCompanyId } from '@/lib/company-utils';
import type z from 'zod';

interface CreateDisciplineFormProps {
    levelId: string;
    levelName: string;
    courseId: string;
}

type CreateDisciplineFormSchema = z.infer<typeof CreateDisciplineFormSchema>;

export function CreateDisciplineForm({ levelId, levelName, courseId }: CreateDisciplineFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [disciplineName, setDisciplineName] = useState('');

    const queryClient = useQueryClient();

    const { mutate: handleCreateDiscipline, isPending } = useMutation({
        mutationFn: (data: CreateDisciplineFormSchema) => createDiscipline({
            ...data,
            company_id: getCurrentCompanyId(),
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setDisciplineName('');
            setIsOpen(false);
        },
        onError: (res) => {
            toast.error(res.message);
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" className='flex items-center justify-center' variant="outline">
                            <BookmarkPlus className="size-5" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className=' mb-3'>
                    Criar nova disciplina
                </TooltipContent>
            </Tooltip>
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