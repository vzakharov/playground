import { useLocalReactive } from "use-vova";
import { defaultData } from "~/lib/jobgenie";

export const data = useLocalReactive('jobgenie-data', defaultData);