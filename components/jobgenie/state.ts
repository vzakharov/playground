import { useLocalReactive } from "use-vova";
import { defaultState } from "~/lib/jobgenie";
import { SectionConfig, sectionConfigs } from "./sections";


export const state = useLocalReactive('jobgenie-state', {
  ...defaultState,
  selectedSectionId: sectionConfigs[0].id as SectionConfig['id']
});

export const { leftovers } = toRefs(state);
