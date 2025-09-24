import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X, Edit } from 'lucide-react';
import { updateDiscipline } from '@/services/disciplines';
import { toast } from 'sonner';
import type { UpdateDisciplineFormData } from '@idiomax/http-schemas/disciplines/update-discipline';

interface EditDisciplineFormProps {
    disciplineId: string;
    currentName: string;
    courseId: string;
    onEditStart?: () => void;
    onEditEnd?: () => void;
}

export function EditDisciplineForm({
    disciplineId,
    currentName,
    courseId,
    onEditStart,
    onEditEnd
}: EditDisciplineFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [disciplineName, setDisciplineName] = useState(currentName);

    const queryClient = useQueryClient();

    const { mutate: handleUpdateDiscipline, isPending } = useMutation({
        mutationFn: (data: UpdateDisciplineFormData) => updateDiscipline({
            id: disciplineId,
            ...data
        }),
        onSuccess: () => {
            toast.success('Disciplina atualizada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setIsEditing(false);
            onEditEnd?.();
        },
        onError: () => {
            toast.error('Erro ao atualizar disciplina');
            setDisciplineName(currentName); // Reset to original value
        },
    });

    const handleStartEdit = () => {
        setIsEditing(true);
        setDisciplineName(currentName);
        onEditStart?.();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setDisciplineName(currentName);
        onEditEnd?.();
    };

    const handleSave = () => {
        if (!disciplineName.trim()) {
            toast.error('Nome da disciplina é obrigatório');
            return;
        }

        if (disciplineName.trim() === currentName) {
            setIsEditing(false);
            onEditEnd?.();
            return;
        }

        handleUpdateDiscipline({
            name: disciplineName.trim(),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancelEdit();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
                <Input
                    value={disciplineName}
                    onChange={(e) => setDisciplineName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-8 text-sm flex-1"
                    autoFocus
                    disabled={isPending}
                />
                <Button
                    type="submit"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={isPending || !disciplineName.trim()}
                >
                    <Save className="size-3" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleCancelEdit}
                    disabled={isPending}
                >
                    <X className="size-3" />
                </Button>
            </form>
        );
    }

    return (
        <div
            className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors w-full"
            onClick={handleStartEdit}
        >
            <span className="text-sm">{currentName}</span>
            <Edit className="size-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
        </div>
    );
}