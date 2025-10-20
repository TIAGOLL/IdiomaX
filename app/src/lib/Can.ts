import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import type { AppAbility } from '@idiomax/authorization';

export const AbilityContext = createContext<AppAbility>(undefined!);
export const Can = createContextualCan(AbilityContext.Consumer);

export default AbilityContext;