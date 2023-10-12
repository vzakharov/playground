import { JobGenieMessage } from "./JobGenieMessage";
import { ChatType } from "./ChatType";
import { GlobalState } from "./state";


export type Leftovers<T extends ChatType> = {
  results: JobGenieMessage<T>[];
  baseId: string | null;
  selectedIndex: number;
};

export function areLeftoversForMessage<T extends ChatType>(
  leftovers: Leftovers<any>,
  { id }: JobGenieMessage<T, "assistant">
): leftovers is Leftovers<T> {
  return !!id && (leftovers.baseId === id);
};

export function getLeftovers<T extends ChatType>(
  globalState: GlobalState,
  type: T
): Leftovers<T> {
  return globalState.leftoversByChatType[type] ?? (
    globalState.leftoversByChatType[type] = {
      results: [],
      baseId: null,
      selectedIndex: 1,
    }
  );
};

export function setLeftovers<T extends ChatType>(
  globalState: GlobalState,
  type: T,
  leftovers: Leftovers<T>
) {
  globalState.leftoversByChatType[type] = leftovers as any;
};
