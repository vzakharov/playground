export function eventHandler<
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