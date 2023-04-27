import styles from './index.less';

export interface MessageProps {
  message: string;
  style?: React.CSSProperties;
}

const Message: React.FC<MessageProps> = ({ message, style }) => {
  return (
    <div className={styles['form-item-error-wrap']} style={style}>
      <span className={styles['item-error']}>{message}</span>
    </div>
  );
};

export default Message;
