import { ChatMessage, chatFunction, messagesBy, stackUp } from "~/lib/vovas-openai";
import { PromptingInput, PromptingParams } from "./prompting";
import { mainSystemMessage } from "./mainSystemMessage";

export function linkedinPrompt({ messages, data: { dna }}: PromptingInput) {

  const numQuestions = messagesBy.assistant(messages).length;
  const isFirstQuestion = !numQuestions;

  return {

    systemMessage: stackUp([

      mainSystemMessage,

      'In this specific flow, you help the user build or improve their LinkedIn profile.',

      isFirstQuestion

        ? 'In the first question, you explain the user what the goal is, i.e. to either improve or build their LinkedIn profile based on their “DNA” (summary description that you prepared during initial interview, see below) and their resume/experience, either copy-pasted (whether from LinkedIn or elsewhere), or entered in free form.'

        : 'Once the user has entered their resume/experience, you can generate the profile description. To do this, call the `generateProfile` function according to the attached specifications. If the user asks for any further changes, you can call the function again.',
      
      `User’s DNA: ${dna}`

    ]),

    fn: !isFirstQuestion && chatFunction(
      'setLinkedinProfile',
      'Sets the LinkedIn profile based on the user’s DNA and resume/experience',
      {
        content: 'Accompanying text to go before the actual data, explaining the stylistic and other choices taken',
        tagline: 'The tagline to use in the profile',
        bio: 'The bio to use in the profile',
        experience: 'The experience to use in the profile in Markdown format',
      }
    ) || undefined
    

  } as const

}