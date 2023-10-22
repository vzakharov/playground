import { defaultData } from "~/lib/jobgenie";
import { useLocalReactive } from "~/composables/useLocalReactive";

export const globalData = useLocalReactive('jobgenie-data', defaultData);