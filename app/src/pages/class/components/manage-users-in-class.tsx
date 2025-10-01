import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import type { GetClassByIdResponseType } from '@idiomax/validation-schemas/class';
import { Badge } from '@/components/ui/badge';

export function ManageUsersInClass({ usersInClass }: { usersInClass: GetClassByIdResponseType['users_in_class'] }) {

    return (
        <div className="space-y-6">
            {/* Tabela de turmas */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="border-b-1 border-b-white/50">
                                <TableRow>
                                    <TableHead>Aluno</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usersInClass?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Nenhum aluno encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usersInClass.map((userInClass) => (
                                        <TableRow key={userInClass.id}>
                                            <TableCell className="font-medium">
                                                {userInClass.users.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge>
                                                    {userInClass.teacher ? 'Professor' : 'Aluno'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {/* <DeleteUserInClass userId={userInClass.id} /> */}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
