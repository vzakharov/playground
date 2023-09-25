import { addProperties } from "vovas-utils";

export function useVisibility(byDefault = false) {

  const visibility = reactive({ on: byDefault });

  addProperties(visibility, {
    toggle: () => visibility.on = !visibility.on,
    show: () => visibility.on = true,
    hide: () => visibility.on = false,
  });

  return visibility;

};