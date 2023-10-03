import { useLocalReactive } from "~/composables/useLocalReactive";
import { defaultData } from "~/lib/jobgenie";

export const data = useLocalReactive('jobgenie-data', defaultData);