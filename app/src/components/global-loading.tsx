import { Loader2 } from 'lucide-react';

/**
 * Componente de loading global simples
 * Usado durante inicialização do app
 */
export function GlobalLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Carregando aplicação...</p>
            </div>
        </div>
    );
}

/**
 * Versão com skeleton mais elaborada
 * Para uso em estados de loading que necessitam mais contexto visual
 */
export function GlobalLoadingSkeleton() {
    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar skeleton */}
            <div className="w-64 border-r border-border p-4 space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 p-8 space-y-6">
                <div className="h-12 bg-muted rounded animate-pulse w-1/3" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
        </div>
    );
}
