import { type Status } from '../interface';
import cn from 'classnames';
import styles from './index.less';

export interface MessageProps {
  status: Status;
  message: string;
  required: boolean;
  value: any;
}

const Message: React.FC<MessageProps> = ({ status, message, required, value }) => {
  let showMessage;
  if (!value && required) {
    showMessage = '不能为空';
  }
  if (status === 'rejected') {
    showMessage = message;
  }
  return (
    <div className={cn(styles['form-message'])}>
      {showMessage && <span className={styles.message}>{showMessage}</span>}
    </div>
  );
};

export default Message;
