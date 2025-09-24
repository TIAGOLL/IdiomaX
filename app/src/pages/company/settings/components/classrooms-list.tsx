import { useQuery } from '@tanstack/react-query';
import { getClassrooms } from '@/services/classrooms';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoaderIcon, School } from 'lucide-react';
import { UpdateClassroomForm } from './update-classroom-form';
import { DeleteClassroomForm } from './delete-classroom-form';
import { Separator } from '@/components/ui/separator';

export function ClassroomsList() {
    const { data, isLoading } = useQuery({
        queryKey: ['classrooms'],
        queryFn: () => getClassrooms(),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoaderIcon className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma sala de aula cadastrada</p>
                <p className="text-sm">Use o formulário acima para criar sua primeira sala</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 space-y-3">
            {data.map((classroom) => (
                <Card key={classroom.id} className="p-3">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <School className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Sala {classroom.number}
                                        </span>
                                        {classroom.block && (
                                            <Badge variant="secondary" className="text-xs">
                                                {classroom.block}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {classroom.block ? `Bloco ${classroom.block}` : 'Sem bloco'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <UpdateClassroomForm classroom={classroom} />
                                <DeleteClassroomForm classroom={classroom} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}