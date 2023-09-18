import { ChatType, chatTypes, isAmong } from '~/lib/jobgenie';
import { computed, ref } from 'vue';
import { data } from '~/components/jobgenie/data';
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

  const disableAllButDna = !data.dna && 'Please complete the interview and pick a DNA first to unlock this section';

  return [
    {
      id: 'dna',
      caption: 'DNA',
      emoji: '🧬'
    },
    {
      id: 'linkedin',
      caption: 'LinkedIn profile',
      emoji: '👔',
      disabled: disableAllButDna,
    },
    {
      id: 'job',
      caption: 'Craft-a-job',
      emoji: '🧪',
      disabled: disableAllButDna,
    },
    {
      id: 'company',
      caption: 'Pitch-a-company',
      emoji: '🏢',
      disabled: disableAllButDna,
    }
  ];
});