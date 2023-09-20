import { setValue } from "lib/jobgenie";

export function blink<T>(ref: Ref<T | null>, value: T): void
export function blink(ref: Ref<boolean | null>): void

export function blink(ref: Ref<any>, value?: any) {
  setValue(ref, value ?? true);
  setTimeout(() => setValue(ref, null), 1000);
}