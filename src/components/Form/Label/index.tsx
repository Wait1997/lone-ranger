import type { ReactNode, PropsWithChildren } from 'react';
import styles from './index.less';

export interface LabelProps {
  label?: ReactNode;
  labelWidth?: number;
  required?: boolean;
}

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ label, labelWidth, required, children }) => {
  return (
    <div className={styles['form-label']}>
      <div className={styles['form-label-name']} style={{ width: labelWidth }}>
        {label && required && <span style={{ color: 'red' }}>*</span>}
        {label && <span>{label}:</span>}
      </div>
      {children}
    </div>
  );
};

export default Label;
