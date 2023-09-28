
export const chatTypes = [
  'dna', 
  'resumé', 
  'job', 
  'pitch', 
  'challenge',
  'social'
] as const;

export type ChatType = (typeof chatTypes)[number];
