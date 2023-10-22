import _ from 'lodash';
import { $throw } from 'vovas-utils';
import { genie } from './refs';
import { ToolId, toolIds } from '~/lib/jobgenie';
import { SidebarMenu } from 'components/shared/SidebarStuff';
import { Tool } from 'lib/genie';

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
  
  const missingTools = genie.toolsById[toolId].getMissingTools(genie.activeAssets);
  const config = sectionConfigs[toolId];

  return {
    id: toolId,
    ...config,
    disabled: !!missingTools,
    disabledTooltip: missingTools 
      && `Please first go through the following sections: ${
        missingTools.map(
          tool => sectionConfigs[tool.id].caption
        ).join(', ')
      }`
  };

} ) );