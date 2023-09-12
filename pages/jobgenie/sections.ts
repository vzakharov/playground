import { computed, ref } from 'vue';
import { data } from '~/components/jobgenie/data';
import { dnaSet } from '~/components/jobgenie/dna';

export type Section = {
  id: string;
  caption: string;
  include?: boolean;
};

// Add your sections here
export const sections = computed<Section[]>(() => [
  {
    id: 'interview',
    caption: 'Interview'
  },
  {
    id: 'dna',
    caption: dnaSet.value ? 'DNA ☜' : 'DNA',
    include: !!data.dna
  }
]);

export const selectedSection = ref<Section>(sections.value[0]);
