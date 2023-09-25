import { ChatType, create, getPromptBuilder } from '~/lib/jobgenie';
import { activeAssets } from './refs';
import _ from 'lodash';
import { map } from 'vovas-utils';

export const sectionConfigs = [
  {
    id: 'dna',
    caption: 'DNA',
    emoji: '🧬',
  },
  {
    id: 'resumé',
    caption: 'Resumé',
    emoji: '👔',
  },
  {
    id: 'job',
    caption: 'Craft-a-job',
    emoji: '🧪',
  },
  {
    id: 'pitch',
    caption: 'Pitch-a-company',
    emoji: '📈',
  }
] as const;

export type SectionConfig = typeof sectionConfigs[number];

export const sections = computed( () => _.map(sectionConfigs, config => {

  return {
    ...config,
    builder: getPromptBuilder(config.id),
    disabled: !getPromptBuilder(config.id).isBuildableWithAssets(activeAssets.value),
  }

} ) );