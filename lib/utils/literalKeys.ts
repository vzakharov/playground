export function literalKeys<K extends string>(object: Record<K, unknown>) {
  return Object.keys(object) as K[];
}