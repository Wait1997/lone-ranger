export type State<T> = {
  [P in keyof T]: T[P];
};

export type Action = Record<string, any>;

export type Reducer<T> = (state: State<T>, action: Action) => State<T>;

export type MapStateToState<T, K> = (state: State<T>) => K;

export type UnSubscribe = () => void;

export interface Store<T, K> {
  getState: (mapStoreToState: MapStateToState<T, K>) => K;
  dispatch: (action: Action) => void;
  subscribe: (connect: Connect<T, K>) => UnSubscribe;
}

export interface Connect<T, K> {
  cacheValue: K;
  update: (state: State<T>) => void;
}
