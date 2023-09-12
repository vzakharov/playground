import { data } from "./data";
import { blink } from "./utils";

export const dnaSet = ref('');

export function setDna(dna: string) {
  data.dna = dna;
  blink(dnaSet, dna);
}