import yaml from 'js-yaml';
import { MatchingOutput, generate } from "..";

const prelimSpecs = {
  title: 'string',
  intro: 'string',
  outline: 'array of strings, to be further expanded into sections',
} as const;

export type Prelims = MatchingOutput<typeof prelimSpecs>;

export const generatePrelims = ( topic: string ) =>
  generate(prelimSpecs, { topic });

export const improvePrelims = ( prelims: Prelims, requestToImprove: string ) =>
  generate(prelimSpecs, { current: yaml.dump(prelims), requestToImprove });