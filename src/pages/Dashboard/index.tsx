import { useConnect } from '@/Hooks';
import { type State } from '@/Hooks/type';
import { type ProvideState } from '@/App';
import { Button } from 'antd';

interface CurrentState {
  id: number;
  study: string;
}

export default function Dashboard() {
  const [state, dispatch] = useConnect<State<ProvideState>, CurrentState>((state) => ({
    id: state.current.id,
    study: state.current.study
  }));

  return (
    <div>
      <div>{state.study}</div>
      <Button
        type='primary'
        onClick={() => {
          dispatch({ type: 'study', payload: { study: '虾仁猪心' } });
        }}
      >
        点击按钮
      </Button>
    </div>
  );
}
