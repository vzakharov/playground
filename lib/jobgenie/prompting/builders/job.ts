import { PromptBuilder } from "~/lib/genie";
import { mainSystemMessage, schema } from "../..";

export const job = new PromptBuilder('job', { 

  schema,
  mainSystemMessage,
  requestFunctionCallAfter: 1,
  prerequisites: ['dna'],

  buildSystemMessages({ requestFunctionCall }) { return {

    pre: 'In this specific flow, you help the user come up with ideas for jobs titles and descriptions that would be a good fit for them based on their “DNA” — a summary description that you prepared during initial interview, — and, optionally, a specific company they’re interested in.',

    post:
      
      !requestFunctionCall

        ? 'In the first question, you explain what you’re going to do and ask if the user has any specific company in mind or any other requirements for the job or if you should make your best guess. Suggest a few job titles as options right away. Don’t greet the user as it’s a continuation of a previous conversation, better start with something like “Alright, now that...”.'

        : 'After the first exchange, call the attached function to generate the job title and description. From then on, you respond to user feedback and adapt those to the user’s needs.'

  }},

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