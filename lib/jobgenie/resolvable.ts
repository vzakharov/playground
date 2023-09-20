export class ResolvablePromiseCanceled extends Error { };

export class Resolvable<T> {

  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  cancel: () => void;

  inProgress = true;
  promise: Promise<T>;

  constructor(
    public basePromise?: Promise<T>,
  ) {

    let { resolve, reject, cancel } = this;

    this.promise = new Promise<T>((res, rej) => {
      resolve = value => { this.inProgress = false; res(value); };
      reject = error => { this.inProgress = false; rej(error); };
      cancel = () => reject(new ResolvablePromiseCanceled());
    });

    this.resolve = resolve;
    this.reject = reject;
    this.cancel = cancel;
    
    basePromise?.then(this.resolve, this.reject);

  };

};

