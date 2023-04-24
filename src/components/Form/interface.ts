export type Status = 'pending' | 'fulfilled' | 'rejected';
export type Rule = RegExp | ((value?: any) => boolean);

export interface ModelValue {
  value: any;
  required?: boolean;
  rule?: Rule;
  message?: string;
  status?: Status;
}

export type Validate = Partial<Omit<ModelValue, 'status'>>;

export type Model = Record<string, ModelValue>;

export interface ControllValue {
  changedValue: () => any;
}

export type Controll = Record<string, ControllValue>;

export interface ErrorFieldItem {
  name: string;
  error: { status?: Status; message?: string };
}

export interface InstanceCallback {
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (values: Record<string, any>, errorFields: ErrorFieldItem[]) => void;
}

interface UpdateAction {
  type: 'setFieldValue';
  name: string;
  value: any;
}

interface GetValueAction {
  type: 'getFieldValue';
  name: string;
}

interface ValidateAction {
  type: 'validateFieldValue';
  name: string;
}

interface GetModelAction {
  type: 'getFieldModel';
  name: string;
}

export type ReducerAction = UpdateAction | GetValueAction | ValidateAction | GetModelAction;

export interface FormInstance {
  setCallback: (callback: InstanceCallback) => void;
  dispatch: (action: ReducerAction) => any;
  registerValidateFields: (name: string, control: ControllValue, model: Validate) => () => void;
  resetFields: () => void;
  setFieldValue: (name: string, modelValue: Validate) => void;
  setFieldsValue: (fields: Record<string, any>) => void;
  getFieldValue: (name: string) => any;
  getFieldsValue: () => Record<string, any>;
  validateFields: (callback: (value: boolean) => void) => void;
  submit: (callback?: (value: boolean) => void) => void;
}
