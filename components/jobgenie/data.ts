import { defaultData } from "~/lib/jobgenie";
import { useLocalReactive } from "~/composables/useLocalReactive";

export const data = useLocalReactive('jobgenie-data', defaultData);