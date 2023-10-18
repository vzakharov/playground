import _ from 'lodash';
import { $throw } from 'vovas-utils';
import { Tool } from '~/lib/jobgenie';
import { genie } from './refs';

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
    tool: 'resumé',
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
      id: Tool,
      tool?: never,
    }
    : {
      tool: Tool
    }
);

export function getSection(id: SectionId) {
  return _.find(sectionConfigs, { id })!;
}

export function getToolName(id: SectionId) {  
  const section = getSection(id);
  return section.tool ?? section.id;
};

export function getSectionConfigForChatType(chatType: Tool) {
  return _.find(sectionConfigs, 
    section => section.tool === chatType || section.id === chatType
  ) ?? $throw(`No section config for chat type ${chatType}`);
};

export const sections = computed( () => _.map(sectionConfigs, config => {
  
  const builder = genie.getPromptBuilder(config.tool ?? config.id);
  const missingTools = builder.getMissingTools(genie.activeAssets);

  return {
    ...config,
    builder,
    disabled: !!missingTools,
    disabledTooltip: missingTools 
      && `Please first go through the following sections: ${
        missingTools.map(
          asset => getSectionConfigForChatType(asset).caption
        ).join(', ')
      }`
  }

} ) );