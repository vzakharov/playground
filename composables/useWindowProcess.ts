import _ from "lodash"
import { $with, addProperties, ensure, is, isLike } from "vovas-utils"

export function isDict<T>(typeguard: (value: any) => value is T) {
  return (value: any): value is NodeJS.Dict<T> => _.isPlainObject(value) && Object.values(value).every(typeguard)
};

export function useWindowProcess() {

  if ( typeof window === 'undefined' )
    throw new Error("useProcessEnv can only be used in a browser environment");

  const process = reactive(

    $with(
      localStorage.getItem('process'), processItem => {

        if ( processItem === null ) return {
          env: {},
        };
        const localProcess = JSON.parse(processItem)
        if ( !isLike({ env: isDict(is.string) })(localProcess) )
          throw new Error("Invalid process object in localStorage");
        return localProcess;
      }

    )
  );

  addProperties(window, { process });

  watch(process, process => {
    localStorage.setItem('process', JSON.stringify(process));
  });

  return process;

};