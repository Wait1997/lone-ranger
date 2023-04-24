export type ResolveType<T> = (value: T) => void;
export type RejectType = (error: unknown) => void;
export type Exector<T> = (resolve: ResolveType<T>, reject?: RejectType) => void;
export type Status = 'pending' | 'fulfilled' | 'rejected';
export type FulfilledCallback<T> = (value?: T) => any;
export type RejectedCallback = (error?: unknown) => any;

export default class Chenmise<T = unknown> {
  private status: Status;
  private value: T | undefined;
  private reason: unknown;
  private readonly fulfilledQueue: Array<() => void>;
  private readonly rejectedQueue: Array<() => void>;

  constructor(exector: Exector<T>) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledQueue = [];
    this.rejectedQueue = [];

    try {
      exector(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  private resolve(value: T) {
    if (this.status !== 'pending') {
      return;
    }
    this.status = 'fulfilled';
    this.value = value;

    while (this.fulfilledQueue.length) {
      const currentTask = this.fulfilledQueue.shift();
      currentTask?.();
    }
  }

  private reject(error: unknown) {
    if (this.status !== 'pending') {
      return;
    }
    this.status = 'rejected';
    this.reason = error;

    while (this.rejectedQueue.length) {
      const currentTask = this.rejectedQueue.shift();
      currentTask?.();
    }
  }

  private resolvePromise(chenmise: Chenmise, results: any, resolve: ResolveType<T>, reject?: RejectType) {
    if (results === chenmise) {
      reject?.(new TypeError('chaining circle detected'));
      return;
    }
    if (results instanceof Chenmise) {
      results.then(
        (value) => {
          resolve(value);
        },
        (error) => {
          reject?.(error);
        }
      );
    } else {
      resolve(results);
    }
  }

  public then(fulfilledCallback?: FulfilledCallback<T>, rejectedCallback?: RejectedCallback) {
    fulfilledCallback = fulfilledCallback ?? ((value) => value);
    rejectedCallback =
      rejectedCallback ??
      ((error) => {
        throw error;
      });

    const chenmise = new Chenmise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        queueMicrotask(() => {
          try {
            const results = fulfilledCallback?.(this.value);
            this.resolvePromise(chenmise, results, resolve, reject);
          } catch (error) {
            reject?.(error);
          }
        });
      } else if (this.status === 'rejected') {
        queueMicrotask(() => {
          try {
            const results = rejectedCallback?.(this.reason);
            this.resolvePromise(chenmise, results, resolve, reject);
          } catch (error) {
            reject?.(error);
          }
        });
      } else {
        if (fulfilledCallback) {
          this.fulfilledQueue.push(() => {
            queueMicrotask(() => {
              try {
                const results = fulfilledCallback?.(this.value);
                this.resolvePromise(chenmise, results, resolve, reject);
              } catch (error) {
                reject?.(error);
              }
            });
          });
        }
        if (rejectedCallback) {
          this.rejectedQueue.push(() => {
            queueMicrotask(() => {
              try {
                const results = rejectedCallback?.(this.reason);
                this.resolvePromise(chenmise, results, resolve, reject);
              } catch (error) {
                reject?.(error);
              }
            });
          });
        }
      }
    });

    return chenmise;
  }

  public catch(rejectedCallback: RejectedCallback) {
    return this.then(undefined, rejectedCallback);
  }

  public finally(callback: () => any) {
    return this.then(
      (value) => {
        return Chenmise.resolve(callback()).then(() => value);
      },
      (error) => {
        return Chenmise.resolve(callback()).then(() => {
          throw error;
        });
      }
    );
  }

  public static resolve<R = unknown>(value: R): Chenmise<R> {
    if (value instanceof Chenmise) {
      return value;
    }
    return new Chenmise((resolve) => {
      resolve(value);
    });
  }
}
