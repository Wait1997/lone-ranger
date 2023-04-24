/* eslint-disable @typescript-eslint/no-floating-promises */
type Fn = (...args: any[]) => Promise<any>;
type PLimitFunction = (concurrency: number) => GeneratorFunc;
type GeneratorFunc = (fn: Fn, ...args: any[]) => Promise<any>;
type NextFunc = () => void;
type RunFunc = (fn: Fn, resolve: (value: any) => void, ...args: any[]) => Promise<void>;
type EnqueueFunc = (fn: Fn, resolve: (value: any) => void, ...args: any[]) => void;

/**
 * 并发控制请求的数量
 * @param concurrency 并发数量
 */
const pLimit: PLimitFunction = (concurrency: number) => {
  if (!(Number.isInteger(concurrency) && concurrency > 0)) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up');
  }

  // 队列存储执行的异步任务
  const queue: Array<(...args: any[]) => Promise<void>> = [];
  // 当前正在执行的并发任务
  let activeCount = 0;

  const next: NextFunc = () => {
    activeCount--;

    if (queue.length > 0) {
      const concurrentTask = queue.shift();
      concurrentTask?.();
    }
  };

  const run: RunFunc = async (fn, resolve, ...args) => {
    activeCount++;

    const result = (async () => await fn(...args))();

    resolve(result);

    try {
      await result;
    } catch {}

    next();
  };

  const enqueue: EnqueueFunc = (fn, resolve, ...args) => {
    queue.push(run.bind(undefined, fn, resolve, ...args));

    (async () => {
      await Promise.resolve();
      console.log(queue.length);
      if (activeCount < concurrency && queue.length > 0) {
        const concurrentTask = queue.shift();
        concurrentTask?.();
      }
    })();
  };

  const generator: GeneratorFunc = (fn, ...args) => {
    return new Promise((resolve) => {
      enqueue(fn, resolve, ...args);
    });
  };

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount
    },
    pendingCount: {
      get: () => queue.length
    },
    clearQueue: {
      value: () => {
        queue.length = 0;
      }
    }
  });

  return generator;
};

const limit = pLimit(2);

function asyncFun(value: string, delay: number) {
  return new Promise((resolve) => {
    console.log('start ' + value);
    setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const arr = [
    limit(() => asyncFun('aaa', 2000)),
    limit(() => asyncFun('bbb', 3000)),
    limit(() => asyncFun('ccc', 1000)),
    limit(() => asyncFun('ccc', 1000)),
    limit(() => asyncFun('ccc', 1000))
  ];

  const result = await Promise.all(arr);
  console.log(result);
})();

// export default pLimit;
