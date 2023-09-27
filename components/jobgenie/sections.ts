import { ChatType, create, getPromptBuilder } from '~/lib/jobgenie';
import { activeAssets } from './refs';
import _ from 'lodash';
import { map } from 'vovas-utils';

export const sectionIds = [ 'dna', 'resume', 'job', 'pitch' ] as const;

export type SectionId = typeof sectionIds[number];

export const sectionConfigs = [
  {
    id: 'dna',
    caption: 'DNA',
    emoji: '🧬',
  },
  {
    id: 'resume',
    chatType: 'resumé',
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
  },
  {
    id: 'challenge',
    caption: 'Challenge me!',
    emoji: '🤨'
  }
] as SectionConfig[];

export type SectionConfig<IdIsChatType extends boolean = boolean> = {
  id: SectionId,
  caption: string,
  emoji: string,
} & (
  IdIsChatType extends true
    ? { 
      id: ChatType,
      chatType?: never,
    }
    : {
      chatType: ChatType
    }
);

export function getSection(id: SectionId) {
  return _.find(sectionConfigs, { id })!;
}

export function getChatType(id: SectionId): ChatType {  
  const section = getSection(id);
  return section.chatType ?? section.id;
}

export const sections = computed( () => _.map(sectionConfigs, config => {
  
  const builder = getPromptBuilder(config.chatType ?? config.id);

  return {
    ...config,
    builder,
    disabled: !builder.isBuildableWithAssets(activeAssets.value),
  }

} ) );