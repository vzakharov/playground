import { systemMessages } from "./system/messages";

export type PromptType = 'interview'; // Add more types as needed

export const prompting = {
  interview: {
    systemMessage: systemMessages.interview,
    // JSON schema for the function call
    functions: [
      {
        name: 'addDna',
        description: 'Adds the DNA (summary) to the user data',
        parameters: {
          type: 'object',
          properties: {
            dna: {
              type: 'string',
              description: 'The DNA to add',
            }
          },
          required: ['dna'],
        }
      }
    ]
  }
} as const;