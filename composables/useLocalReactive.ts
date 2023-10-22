import { Initializer, initialize } from "~/lib/utils";
import _ from "lodash";
import { $if, $try, JsonableObject, give, give$, is } from "vovas-utils"

export function useLocalReactive<T extends object>(key: string, initializer: Initializer<T>) {

  const localValue = 
    $if(
      $try( () => JSON.parse(localStorage.getItem(key) ?? 'null') ),
      is.jsonableObject,
      give.itself
    )
    .else( give$({} as JsonableObject) );

  const value = reactive(
    initialize( localValue, initializer )
  );

  watch( value, () => localStorage.setItem(key, JSON.stringify(value)), { immediate: true } );

  return value as T;
  
};
