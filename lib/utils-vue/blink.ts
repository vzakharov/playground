export function blink<T>(ref: Ref<T | null>, value: T): void
export function blink(ref: Ref<boolean | null>): void

export function blink(ref: Ref<any>, value?: any) {
  ref.value = value ?? true;
  setTimeout(() => ref.value = null, 1000);
}