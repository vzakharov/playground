import _ from "lodash";
import { Usage } from ".";

export const models = ['gpt-3.5-turbo', 'gpt-4'] as const;

export type Model = typeof models[ number ];

export const centsPerMillionTokens = {

  'gpt-3.5-turbo': {
    prompt: 150,
    completion: 200,
  },

  'gpt-4': {
    prompt: 3000,
    completion: 6000,
  },

} as const;


export function getCost(
  usage: Usage,
  model: Model,
) {
  
  const { promptTokens, completionTokens } = usage;
  const cpm = centsPerMillionTokens[ model ];
  const promptUsd = promptTokens * cpm.prompt / 1e8;
  const completionUsd = completionTokens * cpm.completion / 1e8;

  return _.mapValues({
    promptUsd,
    completionUsd,
    totalUsd: promptUsd + completionUsd,
  },
    v => parseFloat(v.toFixed(5))
  );

};
