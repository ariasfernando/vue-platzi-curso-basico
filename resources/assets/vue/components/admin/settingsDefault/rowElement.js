import {
  bgcolor,
  borderGroup,
  classes,
  padding,
  width,
  columnsCounter,
} from './settings';

function rowDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Design',
        settings: [
          columnsCounter(),
          width({ subComponent: 'container', type: 'width' }),
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

module.exports = rowDefault;
