import { DefineComponent } from 'vue';

export function targetedEventHandler<
  T extends Event,
  K extends EventTarget
> (
  classConstructor: { new(): K },
  callback: (event: T & { target: K }) => void
) {
  return (event: T) => {
    const { target } = event;
    if (!(target instanceof classConstructor)) {
      throw new Error(`target is not an instance of ${classConstructor.name}`);
    }
    callback({ ...event, target });
  };
};

export function refForInstance<T extends abstract new (...args: any) => any>(component: T): RefForInstance<T>;
export function refForInstance<T extends (...args: any) => any>(factory: T): RefForInstance<T>;

export function refForInstance<T extends InstanceOrFactoryCreation>(
  _component: T
) {
  return ref() as RefForInstance<T>;
};

export type InstanceOrFactoryCreation = (abstract new (...args: any) => any) | ((...args: any) => any);

export type RefForInstance<T extends 
  InstanceOrFactoryCreation
> = 
  T extends abstract new (...args: any) => any
    ? InstanceType<T>
  : T extends (...args: any) => any
    ? ReturnType<T>
  : never