import {
  bgcolor,
  borderGroup,
  classes,
  padding,
} from './settings';

function codeDefault() {
  return {
    componentSettings: [
      {
        settings: [{
          label: 'Edit Code',
          name: 'data',
          aclName: 'settings_data',
          type: 'generic-code',
          subComponent: 'code',
        }],
      },
      {
        groupLabel: 'Design',
        settings: [
          bgcolor({
            aclName: 'settings_bgcolor',
            subComponent: 'container',
          }),
        ],
      },
      {
        groupLabel: 'Padding (px)',
        settings: [
          padding({
            aclName: 'settings_padding',
            subComponent: 'container',
          }),
        ],
      },
      {
        groupLabel: 'Border',
        settings: [
          borderGroup({
            aclName: 'border_border-group',
            subComponent: 'container',
          }),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          classes({
            aclName: 'settings_classes',
            subComponent: 'container',
          }),
        ],
      },
    ],
  };
}


module.exports = codeDefault;
