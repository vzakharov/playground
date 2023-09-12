import { computed, ref } from 'vue';
import { data } from '~/components/jobgenie/data';
import { dnaJustSet } from '~/components/jobgenie/dna';

export type Section = {
  id: string;
  caption: string;
  emoji: string;
  include?: boolean;
  disabled?: string | false;
};

// Add your sections here
export const sections = computed<Section[]>(() => {

  const disableAllButInterview = !data.dna && 'Please complete the interview and pick a DNA first to unlock this section';

  return [
    {
      id: 'interview',
      caption: 'Interview',
      emoji: '🤝',
    },
    {
      id: 'dna',
      caption: 'DNA' + (dnaJustSet.value ? ' 👈' : ''),
      emoji: '🧬',
      disabled: disableAllButInterview,
    },
    {
      id: 'linkedin',
      caption: 'LinkedIn profile',
      emoji: '👔',
      disabled: disableAllButInterview,
    },
    {
      id: 'job',
      caption: 'Craft-a-job',
      emoji: '🧪',
      disabled: disableAllButInterview,
    },
    {
      id: 'company',
      caption: 'Pitch-a-company',
      emoji: '🏢',
      disabled: disableAllButInterview,
    }
  ];
});

export const selectedSection = ref<Section>(sections.value[0]);
