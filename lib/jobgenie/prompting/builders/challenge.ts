import dedent from "dedent-js";
import { Tool } from "~/lib/genie";
import { mainSystemMessage } from "../mainSystemMessage";
import { dna } from "./dna";
import { job } from "./job";
import { resume } from "./resume";

export const challenge = new Tool('challenge', {

  system: mainSystemMessage,
  generateAssetsAfter: 1,
  reciteAssetsAfter: 1,
  requires: [dna, resume, job],

  build: ({ numResponses, functionCalled, username }) => ({

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

  }),

  assets: {
    question: 'The question to add, rephrased in a way to be as concise and reusable as possible',
    answer: 'The answer to add, in first person and future tense, as if the user is answering the question during the interview',
  }

});
