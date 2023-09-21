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

export function refForInstance<T extends abstract new (...args: any) => any>(
  component: T
) {
  return ref<InstanceType<typeof component>>()
};

export type RefForInstance<T extends abstract new (...args: any) => any> = ReturnType<typeof refForInstance<T>>;