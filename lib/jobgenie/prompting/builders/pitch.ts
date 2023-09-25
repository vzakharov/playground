import dedent from "dedent-js";
import { PromptBuilder } from "../PromptBuilder";
import { mainSystemMessage } from "../mainSystemMessage";

export const pitchPromptBuilder = new PromptBuilder('pitch', {

  mainSystemMessage,
  requestFunctionCallAfter: 0,
  requiredAssets: ['dna'],

  buildSystemMessages({ numResponses, functionCalled }) { return {

    pre: 'In this specific flow, you help the user come up with a way to “pitch” themselves to a potential employer, based on their “DNA” — a summary description that you prepared during initial interview, — and a specific company they’re interested in.',

    post: 

      !numResponses

        ? 'In the first question, you explain what you’re going to do and ask what company they’re interested in. They can either describe it in their words or copy and paste their description from somewhere. Don’t greet the user as it’s a continuation of a previous conversation.'

      : !functionCalled
      
        ? dedent`
          After the first exchange, call the attached function to generate the pitch. Unless the user’s request requires otherwise, use the following structure:

          1. Greet the recipient by name. If you don’t know their name, use a <placeholder>.
          2. Acknowledge the company and its successes.
          3. Introduce yourself (as the user) and explain why you would be happy to work for the company.
          4. Go into some more detail about your background and how it relates to the company, but don’t make it sound like a resume.
          5. End with an open-ended question to encourage the recipient to continue the conversation.

          All in all, the pitch must sound conversational and natural and avoid any kind of boasting or marketing speak.
        `

        : 'Once you’ve already generated the pitch, use the user’s feedback to improve it as needed.'

  } },

  fnArgs: [
    'addPitch',
    'Adds the pitch to the user data',
    {
      content: 'Accompanying comment for the user to introduce the pitch and your reasoning behind it',
      pitch: 'The pitch to add, in Markdown format'
    }
  ]

});