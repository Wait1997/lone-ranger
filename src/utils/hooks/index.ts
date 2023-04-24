import { useEffect, useMemo, useRef, useState } from 'react';

export type FunctionType<T = void> = (...args: any[]) => T;
export type FunctionAsyncType<T extends Element = Element> = (
  e: React.MouseEvent<T>,
  ...args: unknown[]
) => Promise<true>;
export type FunctionSkipOne = () => void;

// 1. 使用useMemo封装useCallback
export const useFunc = <T>(func: FunctionType<T>, deps: unknown[]) => {
  return useMemo(() => {
    return (...args: any[]) => func(...args);
  }, [...deps]);
};

// 2. 点击发送请求回来后，才可以继续发送请求
export const useEventPrevent = (funcAsync: FunctionAsyncType) => {
  const controll = useRef(true);

  return async <T extends Element = Element>(e: React.MouseEvent<T>, ...args: unknown[]) => {
    if (controll.current) {
      controll.current = false;
      try {
        controll.current = await funcAsync(e, ...args);
      } finally {
        controll.current = true;
      }
    }
  };
};

// 3. useEffect跳过首次执行
export const useSkipOneEffect = (func: FunctionSkipOne, deps: unknown[]) => {
  const controll = useRef(false);

  useEffect(() => {
    if (controll.current) {
      func();
    }
    return () => {
      controll.current = true;
    };
  }, [...deps]);
};

// 4. useDebounce
export type Timer = string | number | NodeJS.Timeout | null | undefined;
export type DebounceFunction = (...args: any[]) => void;

const debounce = (func: DebounceFunction, delay?: number) => {
  let timer: Timer = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay ?? 300);
  };
};

export const useDebounce = <T>(initialValue: T, delay?: number): [T, DebounceFunction] => {
  const [value, setValue] = useState<T>(initialValue);

  const delayTime = useMemo(() => delay ?? 300, []);
  const handleValue = useMemo(() => debounce(setValue, delayTime), [delayTime]);
  return [value, handleValue];
};

// 5. useThrottle
const throttle = (func: DebounceFunction, delay?: number) => {
  let prevTime = Date.now();
  return (...args: any[]) => {
    delay = delay ?? 300;
    const currentTime = Date.now();

    if (currentTime - prevTime >= delay) {
      prevTime = currentTime;
      func(...args);
    }
  };
};

export const useThrottle = <T>(initialValue: T, delay?: number): [T, DebounceFunction] => {
  const [value, setValue] = useState<T>(initialValue);

  const delayTime = useMemo(() => delay ?? 300, []);
  const handleValue = useMemo(() => throttle(setValue, delayTime), [delayTime]);
  return [value, handleValue];
};

// 6. 获取同步的useState
export const useSyncState = <T>(initialValue: T): [React.MutableRefObject<T>, (params: T) => void] => {
  const value = useRef<T>(typeof initialValue === 'function' ? initialValue() : initialValue);
  const [, forceUpdate] = useState({});

  const dispatch = (params: T) => {
    value.current = typeof params === 'function' ? params(value.current) : params;
    // 需要同步更新组件
    forceUpdate({});
  };

  return [value, dispatch];
};
