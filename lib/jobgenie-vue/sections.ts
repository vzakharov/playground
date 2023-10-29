import _ from 'lodash';
import { ToolId, toolIds } from '~/lib/jobgenie';
import { jobGenie } from './genie';

export const sectionConfigs: {
  [Id in ToolId]: SectionConfig
} = {
  dna: {
    caption: 'DNA',
    emoji: '🧬',
  },
  resume: {
    caption: 'Resumé',
    emoji: '👔',
  },
  job: {
    caption: 'Craft-a-job',
    emoji: '🧪',
  },
  pitch: {
    caption: 'Pitch-a-company',
    emoji: '📈',
  },
  challenge: {
    caption: 'Challenge me!',
    emoji: '🤨'
  },
  social: {
    caption: 'Social media',
    emoji: '📢'
  }
};

export type SectionConfig = {
  caption: string,
  emoji: string,
};

export const sections = computed( () => _.map(toolIds, toolId => {

  const { missingRequires } = jobGenie.bound[toolId];
  const config = sectionConfigs[toolId];

  return {
    id: toolId,
    ...config,
    disabled: !!missingRequires,
    disabledTooltip: missingRequires 
      && `Please first go through the following sections: ${
        missingRequires.map(
          toolId => sectionConfigs[toolId].caption
        ).join(', ')
      }`
  };

} ) );