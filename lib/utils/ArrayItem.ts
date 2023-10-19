export type ArrayItem<T extends U[] | undefined, U = any> = 
  T extends (infer I extends U)[] ? I : never;