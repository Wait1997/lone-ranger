import React, {
  forwardRef,
  createContext,
  useMemo,
  useReducer,
  useEffect,
  useImperativeHandle,
  type PropsWithChildren,
  type ForwardedRef,
  useContext,
  useCallback
} from 'react';
import type {
  Instance,
  ItemInstance,
  ValidateTrigger,
  Action,
  State,
  Reducer,
  ProviderValue,
  Rules,
  ValidateValue
} from './type';
import Label from './Label';
import Message from './Message';
import cn from 'classnames';

export interface FormProps {
  className?: string;
  initialValues?: Record<string, any>;
  validateTrigger?: ValidateTrigger;
  onSubmit?: () => any;
  onChange?: () => any;
}

export interface ItemProps {
  name: string;
  label: React.ReactNode;
  required: boolean;
  rules: Rules;
  className: string;
}

const defaultContext = { state: { errors: {}, values: {}, itemRefs: {} } };

const FormContext = createContext<ProviderValue>(defaultContext);

const reducer: Reducer<State, Action> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'error.change':
      state.errors = { ...state.errors, [payload.name]: payload.value };
      return { ...state };
    case 'errors.change':
      state.errors = payload.value;
      return { ...state };
    case 'value.change':
      state.values = { ...state.values, [payload.name]: payload.value };
      return { ...state };
    case 'values.change':
      state.values = payload.value;
      return { ...state };
    case 'itemRef.change':
      state.itemRefs[payload.name] = payload.value;
      return { ...state };
    default:
      return state;
  }
};

const ForwardForm = forwardRef<Instance, PropsWithChildren<FormProps>>(function Form(
  { className, initialValues, validateTrigger, onSubmit, onChange, children }: PropsWithChildren<FormProps>,
  ref: ForwardedRef<Instance>
) {
  const [{ values, errors, itemRefs }, dispatch] = useReducer(reducer, {
    ...defaultContext.state,
    values: { ...initialValues }
  });

  const value = useMemo<ProviderValue<typeof dispatch>>(
    () => ({
      state: { errors, values, itemRefs },
      dispatch,
      validateTrigger,
      func: { onSubmit, onChange }
    }),
    [values, errors]
  );

  useImperativeHandle(
    ref,
    () => ({
      // 获取表单值
      getValues: () => values,
      // 获取表单错误信息
      getErrors: () => errors,
      // 重制表单值与错误信息
      reset: () => {
        dispatch({ type: 'values.change', payload: { value: { ...initialValues } } });
        dispatch({ type: 'errors.change', payload: { value: {} } });
      },
      // 验证表单信息并显示相应错误信息
      validateAndControlError: async (name?: string) => {
        //  验证单一表单项
        if (name) {
          try {
            const results = await itemRefs[name].validateAndControlError(values[name]);
            return results;
          } catch (error) {
            throw new Error(`请确认输入的${name}是否正确`);
          }
        }
        // 验证全部表单项
        const results = await Promise.all(
          Object.keys(itemRefs).map((_name) => itemRefs[_name].validateAndControlError(values[_name]))
        );
        return results.reduce((accumulator, currentValue) => accumulator && currentValue, true);
      }
    }),
    [values, errors, itemRefs]
  );

  return (
    <div className={cn(className)}>
      <FormContext.Provider value={value}>
        {React.Children.map(children, (Child) => (React.isValidElement(Child) ? React.cloneElement(Child) : Child))}
      </FormContext.Provider>
    </div>
  );
});

const FormwardItem = forwardRef<ItemInstance, PropsWithChildren<ItemProps>>(function Item(
  { name, label, required = false, rules, className, children }: PropsWithChildren<ItemProps>,
  ref: React.Ref<ItemInstance>
) {
  const {
    state: { errors, values },
    validateTrigger,
    dispatch,
    func
  } = useContext(FormContext);

  // 检验时机
  const validateTiming = useMemo(
    () => (typeof validateTrigger === 'object' ? validateTrigger[name] ?? 'onBlur' : validateTrigger ?? 'onBlur'),
    [validateTrigger]
  );

  const validateValue = async (value: any, rules: Rules): Promise<ValidateValue> => {
    if (rules.required && (value ?? '').trim() === '') {
      return { pass: false, errorMessage: rules?.message };
    }
    if (rules.rule && !rules.rule.pattern.test(value)) {
      return { pass: false, errorMessage: rules.rule.message };
    }
    if (rules.custom && !(await rules.custom.validator(value))) {
      return { pass: false, errorMessage: rules.custom.message };
    }
    return { pass: true };
  };

  const validateAndControlError = useCallback<(value: any, rules: Rules) => Promise<boolean>>(
    async (value: any, rules: Rules) => {
      const { pass, errorMessage } = await validateValue(value, rules);
      // 校验通过
      if (pass) {
        dispatch({ type: 'error.change', payload: { name, value: '' } });
        return true;
      }
      // 校验不通过
      dispatch({ type: 'error.change', payload: { name, value: errorMessage } });
      return false;
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      validateValue: async () => await validateValue(values[name], rules),
      validateAndControlError: async () => await validateAndControlError(values[name], rules)
    }),
    [values]
  );

  const handleValueChange = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const value = event.target.value;
    // 派发更新表单项的值
    dispatch({ type: 'value.change', payload: { name, value } });
    func?.onChange?.({ ...values, [name]: value }, { name, value });
    validateTiming === 'onChange' && (await validateAndControlError(value, rules));
  };

  const handleBlur = async (event: React.ChangeEvent<HTMLFormElement>) => {
    const value = event.target.value;
    validateTiming === 'onBlur' && (await validateAndControlError(value, rules));
  };

  const getControlledProps = () => {
    return {
      name,
      value: values[name],
      onBlur: handleBlur,
      onChange: handleValueChange
    };
  };

  useEffect(() => {
    dispatch({
      type: 'itemRef.change',
      // 父组件调用 validateAndControlError 校验合法性(注册)
      payload: { name, value: { validateAndControlError: async (v: any) => await validateAndControlError(v, rules) } }
    });
  }, [validateAndControlError]);

  return (
    <Label className={className} label={label} required={required}>
      {React.isValidElement(children)
        ? name
          ? React.cloneElement(children, getControlledProps())
          : React.cloneElement(children)
        : children}
      {!!errors[name] && <Message message={errors[name]} />}
    </Label>
  );
});

function Submit({ children }: { children: React.ReactNode }) {
  const {
    state: { values },
    func
  } = useContext(FormContext);

  const getControllProps = () => ({ onClick: () => func?.onSubmit?.(values) });

  return React.isValidElement(children) && React.cloneElement(children, getControllProps());
}

ForwardForm.displayName = 'Form';
FormwardItem.displayName = 'Item';
Submit.displayName = 'Submit';

type FunctionFormType = typeof ForwardForm & { Item: typeof FormwardItem; Submit: typeof Submit };

(ForwardForm as FunctionFormType).Item = FormwardItem;
(ForwardForm as FunctionFormType).Submit = Submit;

export default ForwardForm;
