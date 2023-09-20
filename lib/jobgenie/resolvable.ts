import { addProperties } from "vovas-utils";

export function newResolvablePromise<T>(basePromise: Promise<T> = new Promise<T>(() => {})) {
  // I.e. if no basePromise is provided, then we create a new one that never resolves, assuming that the user will resolve it themselves


  let resolve = (value: T | PromiseLike<T>) => {};
  let reject = (reason?: any) => {};

  const promise = new Promise<T>((...args) => (
    [resolve, reject] = args
  ));

  addProperties(promise, { resolve, reject, inProgress: true });

  basePromise.then(resolve, reject);

  promise.finally(() => promise.inProgress = false);

  return promise;

};

export type ResolvablePromise<T> = ReturnType<typeof newResolvablePromise<T>>;