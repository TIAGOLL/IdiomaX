import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, CheckCircle, XCircle, LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updatePresence } from '@/services/lessons/update-presence';
import { getCurrentCompanyId } from '@/lib/company-utils';
import type { GetLessonByIdResponseType, PresenceItemType } from '@idiomax/validation-schemas/lessons';

export function PresenceListForm({ lesson }: { lesson: GetLessonByIdResponseType }) {
    const queryClient = useQueryClient();
    const [presenceList, setPresenceList] = useState<PresenceItemType[]>(
        lesson.presence_list.map(p => ({
            id: p.id,
            is_present: p.is_present,
            user_id: p.user_id,
            users: p.users
        }))
    );
    const [updatingPresenceId, setUpdatingPresenceId] = useState<string | null>(null);

    const updatePresenceMutation = useMutation({
        mutationFn: async ({ presenceId, isPresent }: { presenceId: string, isPresent: boolean }) => {
            setUpdatingPresenceId(presenceId);
            const response = await updatePresence({
                lesson_id: lesson.id,
                company_id: getCurrentCompanyId(),
                presence_list: [{
                    id: presenceId,
                    is_present: isPresent
                }]
            });
            return response;
        },
        onSuccess: () => {
            toast.success('Presença atualizada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
            setUpdatingPresenceId(null);
        },
        onError: (error) => {
            toast.error(error.message);
            setUpdatingPresenceId(null);
        }
    });

    const handlePresenceChange = (presenceId: string, isPresent: boolean) => {
        // Atualiza o estado local primeiro
        setPresenceList(prev =>
            prev.map(p =>
                p.id === presenceId ? { ...p, is_present: isPresent } : p
            )
        );

        // Salva a alteração imediatamente
        updatePresenceMutation.mutate({ presenceId, isPresent });
    };

    const presentCount = presenceList.filter(p => p.is_present).length;
    const totalStudents = lesson.class.users_in_class.filter(u => !u.teacher).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Lista de Presença
                    </CardTitle>
                    <Badge variant={presentCount === totalStudents ? "default" : "secondary"}>
                        {presentCount}/{totalStudents} presentes
                    </Badge>
                </div>
                <CardDescription>
                    Marque os alunos presentes na aula.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-h-80 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aluno</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Presente</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {presenceList.map((presence) => {
                                const isUpdating = updatingPresenceId === presence.id;
                                return (
                                    <TableRow key={presence.id}>
                                        <TableCell className="font-medium">
                                            {presence.users.name}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {presence.users.email}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={presence.is_present}
                                                    disabled={isUpdating}
                                                    onCheckedChange={(checked) =>
                                                        handlePresenceChange(presence.id, checked as boolean)
                                                    }
                                                />
                                                {isUpdating ? (
                                                    <LoaderIcon className="w-4 h-4 animate-spin text-muted-foreground" />
                                                ) : presence.is_present ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}