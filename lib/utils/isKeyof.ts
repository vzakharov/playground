import { asTypeguard } from "vovas-utils";

export function isKeyOf<Obj extends object>(obj: Obj) {
  return asTypeguard<keyof Obj>((key: string) => key in obj);
};