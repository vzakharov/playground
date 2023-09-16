import dedent from "dedent-js";
import { chatFunction, stackUp } from "~/lib/vovas-openai";
import { mainSystemMessage } from "../mainSystemMessage";
import { PromptBuilder } from "../PromptBuilder";

export const interviewPromptBuilder = new PromptBuilder('dna', { 

  mainSystemMessage,
  requestFunctionCallAfter: 2,

  buildSystemMessage: ({ isFirstResponse, requestFunctionCall }) => [

    'This is the very first part of the interaction — the interview — where you want to help the user discover their “DNA” — a succinct summary of their skills and experience, written in a tone of voice that best represents them, which will then be used to generate any further content.',

    isFirstResponse

      ? dedent`
        In the first question, you very briefly introduce yourself and explain the goal of both the entire platform and the current interaction. Explain how seeing and knowing your “DNA” will help the user get a better idea of what they’re good at and what they should be looking for.
        
        Then, proceed with the initial questions to narrow down the interview.`

      : !requestFunctionCall
      
        ? 'Each question after the first one should ask for some more detail to help come up with the most accurate and representative summary.'

        : dedent`
          After the fourth question or so, call the attached function to generate the actual DNA. Refer to the user in first person (“I ...”) so that they can better relate to the text.
        `
  ],

  fnArgs: [
    'addDna',
    'Adds the DNA (summary) to the user data',
    {
      dna: 'The DNA summary to add',
      content: 'Some short accompanying text to add before the DNA'
    }
  ]

});