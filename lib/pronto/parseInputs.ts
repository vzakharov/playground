import { AnyChatMessage } from "~/lib/vovas-openai";

export type Input = {
  name: string;
  description?: string;
  value: string;
};

export function parseInputs(messages: AnyChatMessage[]) {

  const inputs = [] as Input[];

  for ( const message of messages ) {
    // Take all {name} or {name|description} placeholders
    const matches = message.content?.matchAll(/\{([^\|\}]+)(?:\|([^\}]+))?\}/g);
    for ( const match of matches ?? [] ) {
      const [placeholder, name, description] = match;
      inputs.push({ 
        name, 
        description: description || undefined,
        value: '' 
      });
    };
  };

  return inputs;

};