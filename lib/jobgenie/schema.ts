import { literalKeys } from "lib/utils";
import _ from "lodash";

export const schema = {
  dna: {
    dna: 'DNA'
  },
  resumé: {
    tagline: 'Tagline',
    bio: 'Bio',
    experience: 'Experience'
  },
  job: {
    title: 'Job title',
    description: 'Job description',
    whyMe: 'Why me?',
    whyJob: 'Why this job?'
  },
  pitch: {
    headline: 'Headline',
    pitch: 'Pitch'
  },
  challenge: {
    question: 'Question',
    answer: 'Answer'
  },
  social: {
    post: 'Post body'
  }
} as const;

export type Schema = typeof schema;

// export const tools = literalKeys(schema);