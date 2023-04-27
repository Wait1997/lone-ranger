export type PartialOptional<T, K extends keyof T> = {
  [P in K]?: T[P];
};

export type ValidateTrigger = 'onChange' | 'onBlur' | Record<string, 'onChange' | 'onBlur'>;

export interface Instance {
  getValues: () => Record<string, any>;
  getErrors: () => Record<string, string>;
  reset: () => void;
  validateAndControlError: (name?: string) => Promise<boolean>;
}

export interface ValidateValue {
  pass: boolean;
  errorMessage?: string;
}

export interface ItemInstance {
  validateValue: () => Promise<ValidateValue>;
  validateAndControlError: () => Promise<boolean>;
}

export interface ErrorAction {
  type: 'error.change';
  payload: { name: string; value: string };
}

export interface ErrorsAction {
  type: 'errors.change';
  payload: { value: Record<string, string> };
}

export interface ValueAction {
  type: 'value.change';
  payload: { name: string; value: any };
}

export interface ValuesAction {
  type: 'values.change';
  payload: { value: Record<string, any> };
}

export interface ItemRefsAction {
  type: 'itemRef.change';
  payload: { name: string; value: { validateAndControlError: (value: any) => Promise<boolean> } };
}

export type Action = ErrorAction | ErrorsAction | ValueAction | ValuesAction | ItemRefsAction;

export interface State {
  values: Record<string, any>;
  errors: Record<string, string>;
  itemRefs: Record<string, { validateAndControlError: (value: any) => Promise<boolean> }>;
}

export type Reducer<S, A> = (prevState: S, action: A) => S;

export interface ProviderValue<T = any> {
  state: State;
  dispatch?: T;
  validateTrigger?: ValidateTrigger;
  func?: {
    onSubmit?: (values: Record<string, any>) => any;
    onChange?: (values: Record<string, any>, { name, value }: { name: string; value: any }) => void;
  };
}

export interface Rules {
  required?: boolean;
  rule?: { pattern: RegExp; message: string };
  custom?: {
    validator: (value: any) => Promise<boolean>;
    message: string;
  };
  message?: string;
}
