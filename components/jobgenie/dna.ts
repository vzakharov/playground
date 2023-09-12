import { data } from "./data";
import { blink } from "./utils";

export const dnaJustSet = ref('');

export function setDna(dna: string) {
  data.dna = dna;
  blink(dnaJustSet, dna);
}