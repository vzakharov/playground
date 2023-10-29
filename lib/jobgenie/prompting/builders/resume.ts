import dedent from "dedent-js";
import { AnyTool, Tool, Toolset } from "~/lib/genie";
import { dna, mainSystemMessage, schema } from "../..";

export const resume = new Tool('resume', {

  system: mainSystemMessage,
  generateAssetsAfter: 0,
  requires: [dna],

  build: ({ numResponses }) => ({

    pre: 'In this specific flow, you help the user build or improve their resume based on their DNA (a summary description that you prepared during initial interview, see below)',

    post: [
      
      !numResponses

        ? 'In the first question, you briefly explain the user what the goal is, i.e. to either improve or build their resume based on their “DNA” and existing resume/CV, if any. Tell them that they can either copy and paste it from somewhere right into the input field, or you can go through the questions together. Don’t greet them as it’s a continuation of the previous conversation, so start with something like “Okay, now that...” (not verbatim, in your own words).'


        : dedent`
          During the conversation, if there is not enough information to complete the resume, ask additional questions (one by one, not all at once) to find out any additional information that might be useful for the resume.

          If there is enough information, call the attached function to generate the resume. Your goal is to somehow link the wording to the user’s DNA, increasing the likelihood of them getting hired or at least noticed for the right reasons.
        `,

      "Speak in a friendly yet professional tone and start talking as if it’s a continuation of the interview. Be concise."

    ]

  }),

  assets: {
    tagline: 'The tagline to use in the resume',
    bio: 'The bio to use in the resume',
    experience: 'The experience to use in the resume, in Markdown format',
  }

}) satisfies AnyTool;