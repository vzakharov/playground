import _ from 'lodash';
import { ensure, is } from 'vovas-utils';
import { Ref, onMounted, watch } from 'vue';

export function useHashRoute(ref: Ref<string>): void;
export function useHashRoute<T extends string>(ref: Ref<T>, parse: (hashValue: string) => T): void;
export function useHashRoute<T>(ref: Ref<T>, parse: (hashValue: string) => T, stringify: (value: T) => string): void;

export function useHashRoute<T>(
  ref: Ref<T>,
  parse?: (hashValue: string) => T,
  stringify: (value: T) => string = _.identity
) {
  // Watch for changes in the ref and update the URL hash
  watch(ref, (newVal) => {
    window.location.hash = 
      stringify 
        ? stringify(newVal) 
        : ensure(newVal, is.string, 'useHashRoute: ref must be a string');
  });

  // On component mount, set the ref to the current URL hash
  onMounted(() => {
    if (window.location.hash) {
      const hashValue = window.location.hash.slice(1);

      if ( parse ) {
        ref.value = parse(hashValue);
      } else {
        if (!is.like({ value: is.string })(ref)) {
          throw new Error('useHashRoute: only string refs can be used without a parse function');
        }
        ref.value = hashValue as T & string;
      }
        
    }
  });
};