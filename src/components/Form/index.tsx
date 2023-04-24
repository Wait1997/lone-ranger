import React, {
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
  useEffect,
  useMemo,
  type PropsWithChildren
} from 'react';
import { useForm } from './hook';
import FormContext from './context';
import Label from './Label';
import Message from './Message';
import type { FormInstance, Rule, ErrorFieldItem } from './interface';

export interface FormProps {
  form: FormInstance;
  initialValues: Record<string, any>;
  onFinish: (values: Record<string, any>) => void;
  onFinishFailed: (values: Record<string, any>, errorFields: ErrorFieldItem[]) => void;
}

export interface Rules {
  rule: Rule;
  message: string;
}

export interface FormItemProps {
  name?: string;
  label?: string;
  labelWidth?: number;
  required?: boolean;
  rules?: Rules;
  trigger?: 'onChange' | 'onBlur';
  validateTrigger?: 'onChange' | 'onBlur';
}

export type FormReceivedProps = Partial<FormProps>;

const Form = forwardRef<Omit<FormInstance, 'setCallback' | 'dispatch'>, PropsWithChildren<FormReceivedProps>>(
  (
    { form, initialValues, children, onFinish, onFinishFailed }: PropsWithChildren<FormReceivedProps>,
    ref: React.Ref<Omit<FormInstance, 'setCallback' | 'dispatch'>>
  ) => {
    const formInstance = useForm(form, initialValues);
    const { setCallback, dispatch, ...providerFormInstance } = formInstance;

    // 绑定提交成功、失败的回调函数
    setCallback({ onFinish, onFinishFailed });

    // 向外暴露可执行的方法
    useImperativeHandle(ref, () => providerFormInstance, []);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formInstance.submit();
        }}
        onReset={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formInstance.resetFields();
        }}
      >
        <FormContext.Provider value={formInstance}>
          {React.Children.map(children, (Child) => (React.isValidElement(Child) ? React.cloneElement(Child) : Child))}
        </FormContext.Provider>
      </form>
    );
  }
);

const FormItem = forwardRef<any, PropsWithChildren<FormItemProps>>(
  (
    {
      name,
      label,
      labelWidth,
      children,
      required = false,
      rules,
      trigger = 'onChange',
      validateTrigger = 'onBlur'
    }: PropsWithChildren<FormItemProps>,
    ref: React.Ref<any>
  ) => {
    const formInstance = useContext(FormContext);
    const { registerValidateFields, dispatch } = formInstance!;

    const [, forceUpdate] = useState({});

    const onStoreChange = useMemo(() => {
      return {
        changedValue() {
          forceUpdate({});
        }
      };
    }, [formInstance]);

    useEffect(() => {
      let unRegister: () => void;

      if (name) {
        unRegister = registerValidateFields(name, onStoreChange, { ...rules, required });
      }
      return () => {
        if (unRegister) {
          unRegister();
        }
      };
    }, [onStoreChange, required]);

    const getControlledProps = () => {
      const handleChange = (event: React.ChangeEvent<HTMLFormElement> | string) => {
        const value = typeof event === 'object' ? event.target.value : event;
        if (name) {
          dispatch({ type: 'setFieldValue', name, value });
        }
      };

      if (required && rules) {
        if (validateTrigger === trigger) {
          return {
            [validateTrigger]: (event: React.ChangeEvent<HTMLFormElement> | string) => {
              handleChange(event);
              if (name) {
                dispatch({ type: 'validateFieldValue', name });
              }
            },
            value: name && dispatch({ type: 'getFieldValue', name })
          };
        }
        return {
          [trigger]: handleChange,
          [validateTrigger]: () => {
            if (name) {
              dispatch({ type: 'validateFieldValue', name });
            }
          },
          value: name && dispatch({ type: 'getFieldValue', name })
        };
      }
      return {
        [trigger]: handleChange,
        value: name && dispatch({ type: 'getFieldValue', name })
      };
    };

    return (
      <Label label={label} labelWidth={labelWidth} required={required}>
        {React.isValidElement(children)
          ? name
            ? React.cloneElement(children, getControlledProps())
            : React.cloneElement(children)
          : children}
        {name && <Message {...dispatch({ type: 'getFieldModel', name })} />}
      </Label>
    );
  }
);

Form.displayName = 'Form';
FormItem.displayName = 'FormItem';

export type FormType = typeof Form & { Item: typeof FormItem };

(Form as FormType).Item = FormItem;

export default Form as FormType;
