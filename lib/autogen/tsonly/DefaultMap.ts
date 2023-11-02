export class DefaultMap<K, V> extends Map<K, V> {

  constructor(private defaultFactory: () => V, entries?: readonly (readonly [K, V])[] | null) {
    super(entries);
  };

  get(key: K) {
    if (!super.has(key)) {
      const value = this.defaultFactory();
      super.set(key, value);
      return value;
    }
    return super.get(key) as V;
  };

};