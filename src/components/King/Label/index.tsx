import { type PropsWithChildren } from 'react';
import cn from 'classnames';

export interface LabelProps {
  label?: React.ReactNode;
  required?: boolean;
  labelWidth?: number;
  className?: string;
}

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ label, labelWidth, required, className, children }) => {
  return (
    <div className={cn(className)}>
      <div>
        {required && <span>*</span>}
        <span style={{ width: labelWidth }}>{label}:</span>
      </div>
      {children}
    </div>
  );
};

export default Label;
