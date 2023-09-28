import { Defaults, defaultable } from "~/lib/jobgenie";
import _ from "lodash";
import { $if, $try, JsonableObject, give, give$, is } from "vovas-utils"

export function useLocalReactive<D extends Defaults>(key: string, defaults: D) {

  const localValue = 
    $if(
      $try( () => JSON.parse(localStorage.getItem(key) ?? 'null') ),
      is.jsonableObject,
      give.itself
    )
    .else( give$({} as JsonableObject) );

  const value = reactive(
    defaultable( localValue, defaults )
  );

  watch( value, () => localStorage.setItem(key, JSON.stringify(value)), { immediate: true } );

  return value;
  
};
