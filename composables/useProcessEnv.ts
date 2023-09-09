import _ from "lodash"
import { ensure } from "vovas-utils"

export const useProcessEnv = (key: string) => {

  return (typeof window === 'undefined')

    ? ref(process.env[key] ?? '')
    
    : (() => {

      const processEnv = ref(localStorage.getItem(key) ?? '')

      window.process.env[key] = processEnv.value

      watch(processEnv, env => {
        localStorage.setItem(key, env)
        window.process.env[key] = env
      })

      return processEnv
      
    })();

}