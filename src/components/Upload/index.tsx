import { forwardRef, useRef } from 'react';
import cn from 'classnames';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  type UploadProps,
  type BasicUploadProps,
  type UploadWrapProps,
  type IconButtonUploadProps,
  type UploadButtonWrapProps
} from './type';

const SIZE = 20 * 1024 * 1024;

const Upload: React.ForwardRefRenderFunction<HTMLInputElement, UploadProps> = (
  {
    disabled = false,
    file = { multiple: false, fileType: 'IMAGE', accept: 'image/*', size: SIZE },
    beforeUpload,
    onChooseFile
  },
  ref
) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileData: File[] = Array.prototype.slice.call(event.target.files);
    console.log(fileData);
  };

  return (
    <input
      className={styles['file-upload']}
      type='file'
      ref={ref}
      disabled={disabled}
      multiple={file.multiple}
      accept={file.accept}
      onChange={handleFileChange}
    />
  );
};

const ForwardUpload = forwardRef<HTMLInputElement, UploadProps>(Upload);

const BasicUpload: React.FunctionComponent<React.PropsWithChildren<BasicUploadProps>> = ({
  icon,
  className,
  disabled,
  children,
  onClick
}) => {
  return (
    <div className={cn('basic-upload', className, [disabled])} onClick={onClick}>
      {icon ?? <UploadOutlined className='icon-upload' />}
      {children}
    </div>
  );
};

const IconButtonUpload: React.FunctionComponent<React.PropsWithChildren<IconButtonUploadProps>> = ({
  icon,
  className,
  disabled,
  text,
  children,
  onClick
}) => {
  return (
    <div className={cn(styles['icon-button-upload'], className, { [styles.disabled]: disabled })} onClick={onClick}>
      {icon ?? <UploadOutlined className={styles['icon-upload']} />}
      <span className={styles['icon-button-text']}>{text}</span>
      {children}
    </div>
  );
};

// 图片类型的上传
const UploadWrap: React.FunctionComponent<UploadWrapProps> = ({
  icon,
  className,
  disabled,
  file,
  onClick,
  onChooseFile,
  beforeUpload
}) => {
  const fileEl = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      return;
    }
    if (fileEl.current) {
      fileEl.current?.click();
    }
    onClick?.(event);
  };

  return (
    <BasicUpload icon={icon} className={className} disabled={disabled} onClick={handleClick}>
      <ForwardUpload
        ref={fileEl}
        disabled={disabled}
        file={file}
        beforeUpload={beforeUpload}
        onChooseFile={onChooseFile}
      />
    </BasicUpload>
  );
};

// 按钮类型的上传
const UploadButtonWrap: React.FunctionComponent<UploadButtonWrapProps> = ({
  icon,
  className,
  disabled = false,
  text = '上传',
  file,
  onClick,
  onChooseFile,
  beforeUpload
}) => {
  const fileEl = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      return;
    }
    if (fileEl.current) {
      fileEl.current?.click();
    }
    onClick?.(event);
  };

  return (
    <IconButtonUpload icon={icon} text={text} className={className} disabled={disabled} onClick={handleClick}>
      <ForwardUpload
        ref={fileEl}
        disabled={disabled}
        file={file}
        beforeUpload={beforeUpload}
        onChooseFile={onChooseFile}
      />
    </IconButtonUpload>
  );
};

export default {
  Text: UploadButtonWrap,
  Picture: UploadWrap
};
