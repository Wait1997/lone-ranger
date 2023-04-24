import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { type Reducer, type State, type MapStateToState, type Store, type Action } from './type';
import { ReduxContext } from './context';
import { shallowEqual } from './tools';
import ReduxHooksStore from './logic';

export function useCreateStore<T, K>(reducer: Reducer<T>, initialState: State<T>) {
  const store = useRef<Store<T, K>>();

  if (!store.current) {
    const reduxHooksStore = new ReduxHooksStore<T, K>(reducer, initialState);
    store.current = reduxHooksStore.exportStore();
  }

  return store.current;
}

export function useConnect<T, K>(mapStoreToState: MapStateToState<T, K>): [K, (action: Action) => void] {
  const store = useContext(ReduxContext);
  const { getState, dispatch, subscribe } = store as Store<T, K>;

  const state = useRef(getState(mapStoreToState));
  const [, forceUpdate] = useState({});

  const connect = useMemo(() => {
    const currentConnect = {
      cacheValue: state.current,
      update(newState: State<T>) {
        const selectValue = mapStoreToState(newState);
        const isEqual = shallowEqual(currentConnect.cacheValue, selectValue);

        // 不管浅比较是否相等，每次都赋予最新的值，因为可能通过了shallowEqual，但是值确实发生了变化
        // shallowEqual比较的结果只是更新界面的策略
        currentConnect.cacheValue = selectValue;
        state.current = selectValue;

        !isEqual && forceUpdate({});
      }
    };
    return currentConnect;
  }, [store]);

  useEffect(() => {
    return subscribe(connect);
  }, [connect]);

  return [state.current, dispatch];
}
