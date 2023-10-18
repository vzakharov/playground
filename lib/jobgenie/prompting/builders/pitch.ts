import dedent from "dedent-js";
import { PromptBuilder } from "~/lib/genie";
import { mainSystemMessage, schema } from "../..";

export const pitch = new PromptBuilder('pitch', {

  schema,
  mainSystemMessage,
  requestFunctionCallAfter: 0,
  prerequisites: ['dna'],

  buildSystemMessages({ numResponses, functionCalled }) { return {

    pre: 'In this specific flow, you help the user come up with a way to “pitch” themselves to a potential employer, based on their “DNA” — a summary description that you prepared during initial interview, — and a specific company they’re interested in.',

    post: 

      !numResponses

        ? 'In the first question, you explain what you’re going to do and ask what company they’re interested in. They can either describe it in their words or copy and paste their description from somewhere. Don’t greet the user as it’s a continuation of a previous conversation, so start with something like “Okay, now that...” (not verbatim, in your own words).'

      : !functionCalled
      
        ? dedent`
          After the first exchange, call the attached function to generate the pitch. Unless the user’s request requires otherwise, use the following structure:

          1. Acknowledge the company and its successes.
          2. Introduce yourself (as the user) and explain why you could be useful for the company.
          3. End with an open question to encourage the recipient to continue the conversation.

          Each part shouldn’t be longer than one or two sentences.
        `

        : 'Once you’ve already generated the pitch, use the user’s feedback to improve it as needed.'

  } },

  fnArgs: [
    'addPitch',
    'Adds the pitch to the user data',
    {
      content: 'Accompanying comment for the user to introduce the pitch and your reasoning behind it',
      headline: 'Headline for the pitch (e.g. subject line of an email)',
      pitch: 'The body of the pitch, in Markdown format'
    }
  ]

});