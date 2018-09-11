import campaignSettings from './campaignSettings.vue';
import sie from '../style-image-editor';

export default {
  name: 'background-style-image-editor',
  title: 'background style Image Editor',
  version: '0.0.9',
  author: 'facundo.garcia@stensul.com',
  target: ['module'],
  campaignSettings,
  config: {
    'background-style-image-editor': {
      label: 'Assign Height',
      key: 'assignHeight',
      value: false,
      type: 'switch',
      config: {
        assignHeight: false,
      },
    },
    ...sie.config,
  },
  data: {},
  enabled: false,
  settings: true,
};