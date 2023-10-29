export type PickByArray<T, A extends any[] | undefined> =
  A extends any[] ? Pick<T, A[number]> : {};