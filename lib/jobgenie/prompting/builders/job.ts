import dedent from "dedent-js";
import { chatFunction, stackUp } from "~/lib/vovas-openai";
import { mainSystemMessage } from "../mainSystemMessage";
import { PromptBuilder } from "../PromptBuilder";

export const jobPromptBuilder = new PromptBuilder('job', { 

  mainSystemMessage,
  requestFunctionCallAfter: 1,

  buildSystemMessage: ({ isFirstResponse, requestFunctionCall, data: { dna } }) => [

    'In this specific flow, you help the user come up with ideas for jobs titles and descriptions that would be a good fit for them based on their “DNA” — a summary description that you prepared during initial interview, see below.',

    !requestFunctionCall

      ? 'In the first question, you explain what you’re going to do and ask if there’s anything specific the user would like to do, or if they’d like to just go with the flow (say it in your own words).'

      : 'After that, you call the attached function to generate the job title and description. From then on, you respond to user feedback and adapt those to the user’s needs.',

    `User’s DNA: ${dna}`,

  ],

  fnArgs: [
    'addJob',
    'Adds the job title and description to the user data',
    {
      title: 'The job title to add',
      description: 'The job description to add, in first person and future tense (“I will ...”)',
      whyMe: 'A markdown-formatted bullet list of reasons why the user is a good fit for the job',
      whyJob: 'A markdown-formatted bullet list of reasons why the job is a good fit for the user',
      content: 'Some short accompanying text to add before the generated data, in the same tone as the previous messages'
    }
  ]

});