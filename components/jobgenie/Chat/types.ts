export const chatTypes = ['interview'] as const;

export type ChatType = typeof chatTypes[number];