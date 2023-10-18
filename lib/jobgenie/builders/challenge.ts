import dedent from "dedent-js";
import { PromptBuilder } from "~/lib/genie";
import { mainSystemMessage, schema } from "..";

export const challenge = new PromptBuilder('challenge', {

  schema,
  mainSystemMessage,
  requestFunctionCallAfter: 1,
  addAssetsAfter: 1,
  prerequisites: ['dna', 'resumé', 'job'],

  buildSystemMessages({ numResponses, functionCalled, username }) { return {

    pre: `In this specific flow, you help ${username || 'the user'} come up with ideas for how potential employers could challenge them during the interview process.`,

    post:

      !numResponses

        ? 'First of all, explain what you’re going to do and ask if they already have a challenging question they want to answer, or if they want you to come up with one. Be concise and clear. Don’t greet the user, start writing as if you’re continuing a previous conversation (something like “Okay, now that...”).'

      : !functionCalled

        ? dedent`
          If the user provides a question, think of the best way to answer it and call the attached function.
          
          If they don’t, suggest the most challenging question you can come up with based on the user’s data. Take the weakest point of their professional profile and ask a question that hits that point. Then call the attached function with an answer to that question.
        `

      : 'From here on, respond to user’s feedback and adapt the Q&A generation to the user’s needs.'

  } },

  fnArgs: [
    'addQA',
    'Adds the Q&A to the user data',
    {
      content: 'Some short comment introducing the Q&A, in the same tone as your previous messages.',
      question: 'The question to add, rephrased in a way to be as concise and reusable as possible',
      answer: 'The answer to add, in first person and future tense, as if the user is answering the question during the interview',
    }
  ]

});
