import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { type AppAbility, defineAbilityFor } from '@idiomax/authorization';

// Exportar os tipos do pacote de autorização
export type { AppAbility } from '@idiomax/authorization';

// Criar o contexto com tipo correto (não pode ser undefined)
export const AbilityContext = createContext<AppAbility>({} as AppAbility);

// Criar o componente Can com tipo correto
export const Can = createContextualCan(AbilityContext.Consumer);

// Re-exportar a função de definição de habilidades do pacote
export { defineAbilityFor };