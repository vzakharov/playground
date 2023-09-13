import dedent from "dedent-js";
import { ChatMessage, chatFunction, messagesBy, stackUp } from "~/lib/vovas-openai";
import _ from "lodash";
import { also } from "vovas-utils";
import { mainSystemMessage } from "./mainSystemMessage";
import { PromptingInput, PromptingParams } from "./prompting";

export function interviewPrompt({ messages }: PromptingInput) {

  const numQuestions = messagesBy.assistant(messages).length;
  const requestFunctionCall = numQuestions > 2;

  console.log({ numQuestions, requestFunctionCall });

  return also({

    systemMessage: stackUp([

      mainSystemMessage,

      'In this specific discussion, you interview the user to find out more about their skills, strengths and interests.',

      !requestFunctionCall ? [

        !numQuestions

          ? 'In the first question, you very briefly introduce yourself and ask for the most valuable info that will shape the further conversation. Ask in a way that doesn’t scare off the user by asking all at once.'

          : 'Each question after the first one should ask for some detail to help come up with a better summary description for the user.',

      ] : dedent`
        After the fourth question or so, you’re ready to come up with a summary description, referring to the user in first person (“I ...”). This description will then be used as the “DNA” of sorts for any further content generation, so it should be as succinct yet descriptive as possible.
        
        To do this, call the \`addDna\` function according to the attached specifications. Good luck!`
      ]),

      fn: requestFunctionCall && chatFunction(
        'addDna',
        'Adds the DNA (summary) to the user data',
        {
          dna: 'The DNA to add',
          content: 'Some short accompanying text to add before the DNA, in the same tone as the previous messages'
        }
      ) || undefined
    
  } as const, console.log);

}