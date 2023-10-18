import dedent from "dedent-js";
import { PromptBuilder } from "~/lib/genie";
import { mainSystemMessage, schema } from "..";

export const dna = new PromptBuilder('dna', { 

  schema,
  mainSystemMessage,
  requestFunctionCallAfter: 3,

  buildSystemMessages({ numResponses, requestFunctionCall }) { return { 
      
    pre: 'This is the very first part of the interaction — the interview — where you want to help the user discover their “DNA” — a succinct summary of their skills and experience, written in a tone of voice that best represents them, which will then be used to generate any further content.',

    post: [
      
      !numResponses

        ? dedent`
          In the first question, you very briefly introduce yourself and explain the goal of both the entire platform and the current interaction. Explain how seeing and knowing your “DNA” will help the user get a better idea of what they’re good at and what they should be looking for.
          
          Then, proceed with the first question to narrow down the interview. It should be an open-ended question but also one that is not too broad or hard to answer.
        `
        
        : 'Each question after the first one should ask for some more detail to help come up with the most accurate and representative summary.',

      requestFunctionCall && dedent`
        Once you think you have enough information, call the attached function to generate the actual DNA. Refer to the user in first person (“I ...”) so that they can better relate to the text.
      `
    ]
  } },

  fnArgs: [
    'addDna',
    'Adds the DNA (summary) to the user data',
    {
      dna: 'The DNA summary to add. Use the tone of voice you’ve noticed the user uses in their messages — so it should sound as if it’s written by the user themselves',
      content: 'Some short explanatory text to add before the DNA, from yourself'
    }
  ]

});