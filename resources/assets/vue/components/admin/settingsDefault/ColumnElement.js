import {
  bgcolor,
  borderGroup,
  classes,
  padding,
  width,
} from './settings';

function columnDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Design',
        settings: [
          width({ subComponent: 'container' }),
          bgcolor({ subComponent: 'container' }),
        ],
      },
      {
        groupLabel: 'Padding (px)',
        settings: [
          padding({
            subComponent: 'container',
            aclName: 'padding_padding',
            noLabel: true,
          }),
        ],
      },
      {
        groupLabel: 'Border',
        settings: [
          borderGroup({ subComponent: 'container' }),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          classes({ subComponent: 'container' }),
        ],
      },
    ],
  };
}

module.exports = columnDefault;
