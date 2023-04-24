import { createContext } from 'react';
import { type Store } from './type';

export const ReduxContext = createContext<any>(null);

export function Provider<T, K>({ children, value }: React.PropsWithChildren<{ value: Store<T, K> }>) {
  return <ReduxContext.Provider value={value}>{children}</ReduxContext.Provider>;
}
