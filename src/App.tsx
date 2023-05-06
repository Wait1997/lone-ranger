import { useMemo } from 'react';
import { useCreateStore } from '@/Hooks';
import { Provider } from '@/Hooks/context';
import { type State, type Action } from './Hooks/type';
import Dashboard from '@/pages/Dashboard';
import styles from './App.less';
import Upload from '@/components/Upload';
import TestForForm from '@/pages/TestForForm';
import TestForKing from '@/pages/TestForKing';
import { Divider } from 'antd';

export interface ProvideState {
  current: {
    id: number;
    study: string;
  };
  list: Array<{ id: number; text: string }>;
}

const initialState = {
  current: {
    id: 211,
    study: '飞黄腾达'
  },
  list: [
    { id: 1, text: '今天' },
    { id: 2, text: '明天' }
  ]
};
const reducer = (state: State<ProvideState>, action: Action): State<ProvideState> => {
  if (action.type === 'study') {
    return { ...state, current: { ...state.current, study: action.payload.study } };
  }
  return state;
};

export default function App() {
  const store = useCreateStore(reducer, initialState);

  const memoElement = useMemo(() => <Dashboard />, []);

  return (
    <Provider value={store}>
      <div className={styles.container}>
        <TestForForm />
        <Divider />
        <TestForKing />
      </div>
      <Upload.Text disabled={true} file={{}} />
      {memoElement}
    </Provider>
  );
}
