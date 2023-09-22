import { useLocalReactive } from "use-vova";
import { defaultGlobalState } from "~/lib/jobgenie";
import { SectionConfig, sectionConfigs } from "./sections";


export const globalState = useLocalReactive('jobgenie-state', {
  ...defaultGlobalState,
  selectedSectionId: sectionConfigs[0].id as SectionConfig['id']
});

export const { leftovers } = toRefs(globalState);
