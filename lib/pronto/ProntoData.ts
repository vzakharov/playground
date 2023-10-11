import { says } from "~/lib/vovas-openai";
import { Template } from "./Template";

export const defaultProntoData = {

  templates: [{
    id: 'default',
    messages: [
      says.user('Tell me a joke about {topic}')
    ]
  }] as Template[],

};

export type ProntoData = typeof defaultProntoData;