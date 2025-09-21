import { useSearchParams } from "react-router";

/**
 * Custom hook para facilitar atualizações de search params
 * @returns função updateSearchParams que aceita um objeto com parâmetros para atualizar
 */
export function useSearchParamsHelper() {
    const [, setSearchParams] = useSearchParams();

    const updateSearchParams = (params: Record<string, string | undefined>) => {
        setSearchParams((state) => {
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    state.set(key, value);
                } else {
                    state.delete(key);
                }
            });
            return state;
        });
    };

    const clearSearchParams = (keys: string[]) => {
        setSearchParams((state) => {
            keys.forEach(key => state.delete(key));
            return state;
        });
    };

    return { updateSearchParams, clearSearchParams };
}