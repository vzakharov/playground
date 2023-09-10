import _ from "lodash";
import { getCost, Model } from '.';
import { Camelized, camelize, isCamelCase } from "vovas-utils";
import { CompletionUsage } from "openai/resources";

export type Usage = Camelized<CompletionUsage>;

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
    },

    public cost: UsageCost = {
      promptUsd: 0,
      completionUsd: 0,
      totalUsd: 0,
    }

  ) { }

  addUsage( usage: CompletionUsage | Usage, model: Model ) {
    
    if ( !isCamelCase(usage) ) usage = camelize(usage);

    const { 
      promptTokens, completionTokens, totalTokens
    } = usage;

    const u = this.usage;
    u.promptTokens += promptTokens;
    u.completionTokens += completionTokens;
    u.totalTokens += totalTokens;

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