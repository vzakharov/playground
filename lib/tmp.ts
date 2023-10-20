type MyGenerics<T1, T2, T3, T4, T5> = [T1, T2, T3, T4, T5];

interface MyConfig<T extends MyGenerics<any, any, any, any, any>> {
  param1: T[0];
  param2: T[1];
  param3: T[2];
  param4: T[3];
  param5: T[4];
}

class MyClass<T extends MyGenerics<any, any, any, any, any>> {
  private constructor(private config: MyConfig<T>) {}

  static create<T extends MyGenerics<any, any, any, any, any>>(config: MyConfig<T>) {
    return new MyClass(config);
  }
}

// Usage
const instance = MyClass.create({
  param1: 'string',
  param2: 1,
  param3: true,
  param4: {},
  param5: []
});