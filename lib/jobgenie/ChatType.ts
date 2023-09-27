
export const chatTypes = [
  'dna', 
  'resumé', 
  'job', 
  'pitch', 
  'challenge'
] as const;

export type ChatType = (typeof chatTypes)[number];
