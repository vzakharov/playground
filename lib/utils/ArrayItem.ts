export type ArrayItem<T extends readonly any[] | any[] | unknown> = 
  T extends (infer I)[]
    ? I
  : T extends readonly (infer I)[]
    ? I
  : never;