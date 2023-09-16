import { ChatType, chatTypes, isAmong } from '~/lib/jobgenie';
import { computed, ref } from 'vue';
import { data } from '~/components/jobgenie/data';
import { dnaJustSet } from '~/components/jobgenie/dna';
import { alsoLog } from 'vovas-utils';
import { useLocalRef } from 'use-vova';

export type Section<IsChatBased extends boolean> = {
  id: IsChatBased extends true ? ChatType : string;
  caption: string;
  emoji: string;
  include?: boolean;
  disabled?: string | false;
};

export type AnySection = Section<boolean>;

export function isChatBased(section: AnySection): section is Section<true> {
  return isAmong(chatTypes)(section.id);
}


// Add your sections here
export const sections = computed<AnySection[]>(() => {

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