import dedent from "dedent-js";
import { chatFunction, stackUp } from "~/lib/vovas-openai";
import { mainSystemMessage } from "../mainSystemMessage";
import { PromptBuilder } from "../PromptBuilder";

export const linkedinPromptBuilder = new PromptBuilder('linkedin', {

  mainSystemMessage,
  requestFunctionCallAfter: 0,
  requiredAssets: ['dna'],

  buildSystemMessages({ isFirstResponse, requestFunctionCall, data: { assets: { dna: { dna } } } }) { return {

    pre: 'In this specific flow, you help the user build or improve their LinkedIn profile.',

    post: [
      
      isFirstResponse

        ? 'In the first question, you briefly explain the user what the goal is, i.e. to either improve or build their LinkedIn profile based on their “DNA” (summary description that you prepared during initial interview, see below) and their resume/experience, either copy-pasted (whether from LinkedIn or elsewhere), or entered in free form.'

        : dedent`Once the user has entered their resume/experience, you can generate the profile description. Your goal is to somehow link that experience to the user’s DNA, increasing the likelihood of them getting hired or at least noticed for the right reasons.

        It makes sense to first ask a couple questions to find out any additional information that might be useful for the profile.
        
        Once you’ve decided, call the function according to the attached specifications. If the user asks for any further changes, you can call the function again.`,
      
      `User’s DNA: ${dna}`,

      "Speak in a friendly yet professional tone and start talking as if it’s a continuation of the interview. Be concise."

    ]

  }},

  fnArgs: [
    'addProfile',
    'Sets the LinkedIn profile based on the user’s DNA and resume/experience',
    {
      content: 'Accompanying text to go before the actual data, explaining the stylistic and other choices taken',
      tagline: 'The tagline to use in the profile',
      bio: 'The bio to use in the profile',
      experience: 'The experience to use in the profile in Markdown format',
    }
  ]

});