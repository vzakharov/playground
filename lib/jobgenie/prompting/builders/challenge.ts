import { PromptBuilder } from "../PromptBuilder"
import { mainSystemMessage } from "../mainSystemMessage";

export const challengePromptBuilder = new PromptBuilder('challenge', {

  mainSystemMessage,
  requestFunctionCallAfter: 2,
  requiredAssets: ['resumé'],

  buildSystemMessages({ numResponses, requestFunctionCall, functionCalled, username }) { return {

    pre: `In this specific flow, you help ${username || 'the user'} come up with ideas for how potential employers could challenge them during the interview process.`,

    post:

      !numResponses

        ? 'In the first question, you explain what you’re going to do and suggest the most challenging question you can come up with based on the user’s resumé. Take the weakest point of their professional profile and ask a question that hits that point (highlight the question in *italics*). Make sure you let them know it’s not personal and that you’re just trying to help them prepare for the worst. Don’t greet the user as it’s a continuation of a previous conversation.'

      : !requestFunctionCall

        ? 'After the user answers, analyze their response and give your honest opinion on it. Be concrete yet polite. Then ask them if they want you to come up with a Q&A card for that question.'

      : !functionCalled

        ? 'If the user asks, call the attached function to add a Q&A assets to their data. Don’t just repeat the question and answer, but rephrase them in a way that’s as concise and reusable as possible.'

      : 'From here on, you respond to user feedback and adapt the Q&A generation to the user’s needs.'

  } },

  fnArgs: [
    'addQA',
    'Adds the Q&A to the user data',
    {
      content: 'Some short comment introducing the Q&A',
      question: 'The question to add, rephrased in a way to be as general and reusable as possible',
      answer: 'The answer to add, in first person and future tense, as if the user is answering the question during the interview',
    }
  ]

});
