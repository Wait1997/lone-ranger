import { useRef } from 'react';
import type {
  Status,
  Model,
  ModelValue,
  ErrorFieldItem,
  Validate,
  Controll,
  ControllValue,
  InstanceCallback,
  ReducerAction,
  FormInstance
} from '../interface';

export class FormStore {
  private model: Model = {};
  private controll: Controll = {};
  private callback: InstanceCallback = {};
  private readonly validateQueue: Array<() => void> = [];
  private readonly defaultFormValue: Record<string, any> = {};

  constructor(defaultFormValue: Record<string, any> = {}) {
    // 初始化表单的值
    this.defaultFormValue = defaultFormValue;
  }

  public getForm(): FormInstance {
    return {
      setCallback: this.setCallback.bind(this),
      dispatch: this.dispatch.bind(this),
      registerValidateFields: this.registerValidateFields.bind(this),
      resetFields: this.resetFields.bind(this),
      setFieldValue: this.setFieldValue.bind(this),
      setFieldsValue: this.setFieldsValue.bind(this),
      getFieldValue: this.getFieldValue.bind(this),
      getFieldsValue: this.getFieldsValue.bind(this),
      validateFields: this.validateFields.bind(this),
      submit: this.submit.bind(this)
    };
  }

  private static createValidate(validate: Validate): ModelValue {
    const { value, rule, required, message } = validate;
    return {
      value,
      rule: rule ?? (() => true),
      required: required ?? false,
      message: message ?? '',
      status: 'pending'
    };
  }

  private setCallback(callback: InstanceCallback) {
    if (callback) {
      this.callback = callback;
    }
  }

  private registerValidateFields(name: string, controll: ControllValue, model: Validate) {
    // 添加默认值
    if (this.defaultFormValue[name]) {
      model.value = this.defaultFormValue[name];
    }
    // 注册默认校验
    const validate = FormStore.createValidate(model);

    this.model[name] = validate;
    // controll控制更新formItem
    this.controll[name] = controll;

    return () => {
      delete this.model[name];
      delete this.controll[name];
    };
  }

  private notifyChanged(name: string): void {
    const controller = this.controll[name];
    controller.changedValue();
  }

  private resetFields(): void {
    for (const [name, validate] of Object.entries(this.model)) {
      this.setValueAndClearStatus(validate, name, undefined);
    }
  }

  private setFieldValue(name: string, model: Validate | string): void {
    const validate = this.model[name];

    if (!validate) {
      return;
    }

    if (typeof model === 'object') {
      const { value, rule, message } = model;
      if (value) {
        validate.value = value;
      }
      if (message) {
        validate.message = message;
      }
      if (rule) {
        validate.rule = rule;
      }
      validate.status = 'pending';
      // 如果重新设置了验证规则，那么重新验证一次
      this.validateFieldValue(name);
      return;
    }

    this.setValueAndClearStatus(validate, name, model);
  }

  private setFieldsValue(values: Record<string, any>) {
    if (Object.prototype.toString.call(values) !== '[object Object]') {
      return;
    }

    for (const [name, model] of Object.entries(values)) {
      this.setFieldValue(name, model);
    }
  }

  private getFieldValue(name: string) {
    const model = this.model[name];

    if (!model && this.defaultFormValue[name]) {
      // 没有注册，但是存在默认值的情况
      return this.defaultFormValue[name];
    }

    return model?.value;
  }

  private getFieldModel(name: string) {
    const model = this.model[name];
    if (!model) {
      return;
    }
    return model;
  }

  private getFieldsValue() {
    const formData: Record<string, any> = {};

    for (const [name, model] of Object.entries(this.model)) {
      formData[name] = model.value;
    }

    return formData;
  }

  private setValueAndClearStatus(model: ModelValue, name: string, value: any): void {
    model.value = value;
    model.status = 'pending';

    // 触发视图更新
    this.notifyChanged(name);
  }

  private validateFieldValue(name: string) {
    const model = this.model[name];
    if (!model) {
      return;
    }

    const currentStatus = model.status;
    const { value, rule, required } = model;
    let status: Status = 'fulfilled';
    if (required) {
      if (!value) {
        status = 'rejected';
      } else if (rule instanceof RegExp) {
        status = rule.test(value) ? 'fulfilled' : 'rejected';
      } else {
        // 自定义规则
        if (rule instanceof Function) {
          status = rule(value) ? 'fulfilled' : 'rejected';
        } else {
          // 剩下的规则处理
          status = 'pending';
        }
      }
    }
    model.status = status;

    if (status !== currentStatus) {
      const notify = this.notifyChanged.bind(this, name);
      this.validateQueue.push(notify);
    }

    this.scheduleValidate();
    return status;
  }

  private validateFields(callback: (value: boolean) => void) {
    let status = true;
    // 有一个状态为rejected则校验失败
    for (const name of Object.keys(this.model)) {
      const currentStatus = this.validateFieldValue(name);
      if (currentStatus === 'rejected') {
        status = false;
      }
    }
    callback(status);
  }

  private scheduleValidate() {
    // 微任务队列
    queueMicrotask(() => {
      // 更新视图
      for (const notify of this.validateQueue) {
        notify();
      }
    });
  }

  private submit(callback?: (value: boolean) => void) {
    this.validateFields((status) => {
      const { onFinish, onFinishFailed } = this.callback;
      callback?.(status);

      const forms = this.getFieldsValue();
      if (!status) {
        const errorFields: ErrorFieldItem[] = [];
        for (const [name, validate] of Object.entries(this.model)) {
          errorFields.push({ name, error: { status: validate.status, message: validate.message } });
        }
        typeof onFinishFailed === 'function' && onFinishFailed(forms, errorFields);
        return;
      }
      typeof onFinish === 'function' && onFinish(forms);
    });
  }

  private dispatch(action: ReducerAction) {
    switch (action.type) {
      case 'setFieldValue':
        this.setFieldValue(action.name, action.value);
        return;
      case 'getFieldValue':
        return this.getFieldValue(action.name);
      case 'validateFieldValue':
        return this.validateFieldValue(action.name);
      case 'getFieldModel':
        return this.getFieldModel(action.name);
      default:
        break;
    }
  }
}

export function useForm(form?: FormInstance, defaultFormValue?: Record<string, any>) {
  const formEl = useRef<FormInstance | null>(null);

  if (formEl.current === null) {
    if (form) {
      formEl.current = form;
    } else {
      const formStore = new FormStore(defaultFormValue);
      formEl.current = formStore.getForm();
    }
  }
  return formEl.current;
}
