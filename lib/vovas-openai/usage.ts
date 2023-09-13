import _ from "lodash";
import { getCost, keysOf, Model } from '.';
import { $if, $with, Camelized, camelize, check, give, is, isCamelCase } from "vovas-utils";
import { CompletionUsage } from "openai/resources";

export type TokenUsage = Camelized<CompletionUsage>;

export type Usage = TokenUsage & {
  promptJsonChars: number;
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
      promptJsonChars: 0,
      msTaken: {},
    },

    public cost: UsageCost = {
      promptUsd: 0,
      completionUsd: 0,
      totalUsd: 0,
    }

  ) { }

  msPerPromptJsonChar(model: Model) {
    return ( this.usage.msTaken[model] ?? 0 / this.usage.promptJsonChars ) || undefined;
  }

  addUsage( model: Model, { msTaken: { [model]: msTaken }, ...usage }: Usage ) {

    const { usage: u, cost: c } = this;
    
    for ( const k of keysOf(usage) ) {
      u[k] += usage[k];
    }
    u.msTaken[model] = ( u.msTaken[model] ?? 0 ) + ( msTaken ?? 0 );
    
    const cost = getCost(usage, model);

    for ( const k of keysOf(this.cost) ) {
      c[k] = parseFloat(
        ( c[k] + cost[k] )
        .toFixed(5)
      );
    }


  };

};

export const globalUsageContainer = new UsageContainer();