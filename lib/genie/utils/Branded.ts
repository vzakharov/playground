
export type Branded<T, B extends symbol> = T & {
  [brand in B]: void;
};

export type Unbrand<T, B extends symbol> = 
  T extends Branded<infer U extends string, B> 
    ? U
    : never;

export function branded<B extends symbol>(value: string) {
  return value as Branded<string, B>;
}