import { ChatType, create, getPromptBuilder } from '~/lib/jobgenie';
import { activeAssets } from './refs';
import _ from 'lodash';
import { $throw, map } from 'vovas-utils';

export const sectionIds = [ 'dna', 'resume', 'job', 'pitch', 'social' ] as const;

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
  },
  {
    id: 'social',
    caption: 'Social media',
    emoji: '📢'
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
};

export function getSectionConfigForChatType(chatType: ChatType) {
  return _.find(sectionConfigs, 
    section => section.chatType === chatType || section.id === chatType
  ) ?? $throw(`No section config for chat type ${chatType}`);
};

export const sections = computed( () => _.map(sectionConfigs, config => {
  
  const builder = getPromptBuilder(config.chatType ?? config.id);
  const missingAssets = builder.getMissingAssets(activeAssets.value);

  return {
    ...config,
    builder,
    disabled: !!missingAssets,
    disabledTooltip: missingAssets 
      && `Please first go through the following sections: ${
        missingAssets.map(
          asset => getSectionConfigForChatType(asset).caption
        ).join(', ')
      }`
  }

} ) );