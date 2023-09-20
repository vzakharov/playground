export class ResolvablePromise<T> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  inProgress: boolean;

  constructor(basePromise: Promise<T> = new Promise<T>(() => {})) {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    super((...args) => [resolve, reject] = args);

    this.resolve = resolve!;
    this.reject = reject!;
    this.inProgress = true;

    basePromise.then(this.resolve, this.reject);

    this.finally(() => this.inProgress = false);
  }
}