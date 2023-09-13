import _ from "lodash";
import { getCost, Model } from '.';
import { $if, Camelized, camelize, check, give, is, isCamelCase } from "vovas-utils";
import { CompletionUsage } from "openai/resources";

export type TokenUsage = Camelized<CompletionUsage>;

export type Usage = TokenUsage & {
  msTaken: { [model in Model]?: number };
}

export type UsageCost = {
  promptUsd: number;
  completionUsd: number;
  totalUsd: number;
};

export class UsageContainer {

  constructor(

    public usage: Usage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      msTaken: {},
    },

    public cost: UsageCost = {
      promptUsd: 0,
      completionUsd: 0,
      totalUsd: 0,
    }

  ) { }

  msPerPromptToken(model: Model) {
    return ( this.usage.msTaken[model] ?? 0 / this.usage.promptTokens ) || undefined;
  }

  addUsage( model: Model, { msTaken: { [model]: msTaken }, ...usage }: Usage ) {
    
    const { 
      promptTokens, completionTokens, totalTokens,
    } = usage;

    const u = this.usage;
    u.promptTokens += promptTokens;
    u.completionTokens += completionTokens;
    u.totalTokens += totalTokens;
    u.msTaken[model] = ( u.msTaken[model] ?? 0 ) + ( msTaken ?? 0 );

    const { 
      promptUsd, completionUsd, totalUsd
    } = getCost(usage, model);

    const c = this.cost;
    c.promptUsd += promptUsd;
    c.completionUsd += completionUsd;
    c.totalUsd += totalUsd;

    this.cost = _.mapValues(c, v => parseFloat(v.toFixed(5)));

  };

};

export const globalUsageContainer = new UsageContainer();