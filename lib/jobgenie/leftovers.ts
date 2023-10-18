import { JobGenieMessage } from "./JobGenieMessage";
import { Tool } from "./ChatType";
import { GlobalState } from "./state";


export type Leftovers<T extends Tool> = {
  results: JobGenieMessage<T>[];
  baseId: string | null;
  selectedIndex: number;
};

export function areLeftoversForMessage<T extends Tool>(
  leftovers: Leftovers<any>,
  { id }: JobGenieMessage<T, "assistant">
): leftovers is Leftovers<T> {
  return !!id && (leftovers.baseId === id);
};

export function getLeftovers<T extends Tool>(
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

export function setLeftovers<T extends Tool>(
  globalState: GlobalState,
  type: T,
  leftovers: Leftovers<T>
) {
  globalState.leftoversByChatType[type] = leftovers as any;
};
