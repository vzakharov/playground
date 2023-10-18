import dedent from "dedent-js";
import { PromptBuilder } from "~/lib/genie";
import { mainSystemMessage, schema } from "../..";

export const socialBuilder = new PromptBuilder('social', {

  schema,
  mainSystemMessage,
  requestFunctionCallAfter: 2,
  addAssetsAfter: 1,
  prerequisites: ['dna'],
  buildSystemMessages({ numResponses, functionCalled, username }) { return {
    pre: `In this specific flow, you help ${username || 'the user'} come up with social posts on topics related to their professional profile, reflecting their personality, stance and tone.`,

    post:

      !numResponses

        ? 'First of all, explain what you’re going to do and why it’s important to have a reputable social presence to improve their professional profile. Ask if they already have a topic they want to write about, or if they want you to come up with one. Tell them they can copy and paste some external content (e.g. an article they’ve read) if they want to, suggesting to use Markdown code blocks to format it (wrapped in triple backticks and newlines). Be concise and clear. Don’t greet the user, start writing as if you’re continuing a previous conversation, with something like “Okay, here’s the thing...” (not verbatim, in your own words).'

      : numResponses === 1

        ? 'The next step is to ask the user questions to find out (a) what their stance on the topic is, and (b) what their usual tone on social media is. Come up wiht 3—5 questions that will help you find out these things. Ask them all at once and let the user answer them in any order they want, or without any order ay all.'

      : !functionCalled

        ? 'If you have enough information, call the attached function with the content of the post. If you don’t, ask more questions to find out more about the user’s stance and tone.'

      // : 'From here on, respond to user’s feedback to adapt the post to the user’s needs. If they come up with a new topic or piece of content, start the process again, asking questions to find out their stance and tone. Once you have the answers, call the attached function with the content of the post. To be clear, do NOT call the function until you’ve asked your questions and have the answers.'

      : dedent`
        From here on, there are two options:

        1. If the user comes up with a new topic or piece of content, start the process again, asking questions to find out their stance and tone. Once you have the answers, call the attached function with the content of the post. To be clear, do NOT call the function until you’ve asked your questions and have the answers.

        2. If the user requests to adapt your generation in some way, call the function again with an updated version of the post.
      `


  } },
  fnArgs: [
    'addSocial',
    'Adds a social post to the user data',
    {
      content: 'Some short comment introducing the post (to the user, not the audience), in the same tone as the previous `content`.',
      post: 'The body of the post, written to reflect both the user’s personality and their tone on social media'
    }
  ]
});