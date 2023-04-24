import { type Reducer, type State, type MapStateToState, type Action, type Store, type Connect } from './type';

export default class ReduxHooksStore<T, K> {
  private readonly reducer: Reducer<T>;
  private state: State<T>;
  private readonly addListener: Array<Connect<T, K>>;

  constructor(reduder: Reducer<T>, initialState: State<T>) {
    this.reducer = reduder;
    this.state = initialState;
    this.addListener = [];
  }

  private getState(mapStoreToState: MapStateToState<T, K>) {
    return mapStoreToState(this.state);
  }

  private dispatch(action: Action) {
    this.state = this.reducer(this.state, action);
    this.updateRender();
  }

  private subscribe(connect: Connect<T, K>) {
    this.addListener.push(connect);

    return () => {
      this.addListener.filter((item) => !(item === connect));
    };
  }

  private updateRender() {
    for (const listener of this.addListener) {
      const { update } = listener;
      update(this.state);
    }
  }

  public exportStore(): Store<T, K> {
    return {
      getState: this.getState.bind(this),
      dispatch: this.dispatch.bind(this),
      subscribe: this.subscribe.bind(this)
    };
  }
}
