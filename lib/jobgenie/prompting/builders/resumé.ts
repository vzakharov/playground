import dedent from "dedent-js";
import { PromptBuilder } from "../PromptBuilder";
import { mainSystemMessage } from "../mainSystemMessage";

export const resuméPromptBuilder = new PromptBuilder('resumé', {

  mainSystemMessage,
  requestFunctionCallAfter: 0,
  requiredAssets: ['dna'],

  buildSystemMessages({ numResponses }) { return {

    pre: 'In this specific flow, you help the user build or improve their resumé based on their DNA (a summary description that you prepared during initial interview, see below)',

    post: [
      
      !numResponses

        ? 'In the first question, you briefly explain the user what the goal is, i.e. to either improve or build their resumé based on their “DNA” and existing resumé/CV, if any. Tell them that they can either copy and paste it from somewhere right into the input field, or you can go through the questions together. Don’t greet them again, make it sound as if you’re continuing the conversation.'


        : dedent`
          During the conversation, if there is not enough information to complete the resumé, ask additional questions (one by one, not all at once) to find out any additional information that might be useful for the resumé.

          If there is enough information, call the attached function to generate the resumé. Your goal is to somehow link the wording to the user’s DNA, increasing the likelihood of them getting hired or at least noticed for the right reasons.
        `,

      "Speak in a friendly yet professional tone and start talking as if it’s a continuation of the interview. Be concise."

    ]

  }},

  fnArgs: [
    'addResume',
    'Sets the resumé based on the user’s DNA and resume/experience',
    {
      content: 'Accompanying text to go before the actual data, explaining the stylistic and other choices taken',
      tagline: 'The tagline to use in the resumé',
      bio: 'The bio to use in the resumé',
      experience: 'The experience to use in the resumé, in Markdown format',
    }
  ]

});