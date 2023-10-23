import _ from "lodash";
import { $with } from "vovas-utils";
import { AnyTool, Chat, GenieMessage } from "~/lib/genie";
import { isBy } from "~/lib/vovas-openai";
import { computed } from "vue";

export type UseMessageButtonsParams<T extends AnyTool> = {
  message: GenieMessage<T>;
  chat: Chat<T>;
};

export function useMessageButtons<T extends AnyTool>({ message, chat }: UseMessageButtonsParams<T>) {
  
  return computed( () => [
    ...isBy.assistant(message) ? [
      ...chat.areLeftoversDefined() && chat.messageWithLeftovers === message ? 
      $with(chat.data, ({ leftovers }) => [
        {
          caption: `${leftovers.activeMessageOriginalIndex}/${leftovers.results.length + 1}`,
          tooltip: 'Loop through alternatives',
          onClick: () => chat.cycleLeftovers()
        },
        {
          caption: '🗑',
          tooltip: 'Delete this alternative',
          onClick: () => chat.replaceActiveMessageWithLeftover()
        }
      ]) : [],
      {
        caption: '↺',
        tooltip: 'More alternatives',
        onClick: () => chat.regenerate(message)
      },
      message === chat.messageWithActiveAssets && {
        caption: 'Use this',
        tooltip: 'Set this asset globally for any relevant generations',
        onClick: () => message.assetsPickedAt = Date.now()
      }
    ] : isBy.user(message) ? [
      {
        caption: '✎',
        tooltip: 'Edit',
        onClick: () =>
          (
            message === _.last(chat.messages)
            || window.confirm('This will delete all messages after this one. Are you sure?') 
          ) && chat.editMessage(message)
      },
    ] : []
  ] );

};