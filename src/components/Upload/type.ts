export type FileType = 'IMAGE' | 'AUDIO' | 'VIDEO';

export interface FileChooseProps {
  size?: number;
  fileType?: FileType;
  multiple?: boolean;
  accept?: string;
}

export interface UploadProps {
  disabled?: boolean;
  file: FileChooseProps;
  onChooseFile?: (value: any) => void;
  beforeUpload?: BeforeUpload;
}

export type BeforeUpload = (file: File | File[]) => boolean | Promise<File | File[]>;

export interface BasicUploadProps {
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export type IconButtonUploadProps = BasicUploadProps & { text?: string };

export interface UploadWrapProps {
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  file: FileChooseProps;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onChooseFile?: (value: any) => void;
  beforeUpload?: BeforeUpload;
}

export type UploadButtonWrapProps = UploadWrapProps & { text?: string };
