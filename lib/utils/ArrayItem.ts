export type ArrayItem<T extends readonly any[] | any[] | unknown, U = any> = 
  T extends (infer I extends U)[]
    ? I
  : T extends readonly (infer I extends U)[]
    ? I
  : never;