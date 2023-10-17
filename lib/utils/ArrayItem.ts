export type ArrayItem<T extends any[] | undefined> = T extends (infer U)[] ? U : never;