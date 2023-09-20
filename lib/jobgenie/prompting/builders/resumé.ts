import dedent from "dedent-js";
import { chatFunction, stackUp } from "~/lib/vovas-openai";
import { mainSystemMessage } from "../mainSystemMessage";
import { PromptBuilder } from "../PromptBuilder";

export const resuméPromptBuilder = new PromptBuilder('resumé', {

  mainSystemMessage,
  requestFunctionCallAfter: 0,
  requiredAssets: ['dna'],

  buildSystemMessages({ isFirstResponse }) { return {

    pre: 'In this specific flow, you help the user build or improve their resumé based on their DNA (a summary description that you prepared during initial interview, see below)',

    post: [
      
      isFirstResponse

        ? 'In the first question, you briefly explain the user what the goal is, i.e. to either improve or build their resumé based on their “DNA”  and existing resumé/CV, if any. Tell them that they can either copy and paste it by clicking the “multi-line” button under the input field, or you can go through the questions together.'


        : dedent`
          Once the user has provided the data to base the resumé on, you can generate the resumé. Your goal is to somehow link the wording to the user’s DNA, increasing the likelihood of them getting hired or at least noticed for the right reasons.

          If there is not enough information to complete the resumé, ask additional questions to find out any additional information that might be useful for the resumé.

          If there is enough information, call the attached function.
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