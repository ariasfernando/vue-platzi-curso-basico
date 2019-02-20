import {
  bgcolor,
  borderGroup,
  classes,
  columnsStacking,
  padding,
} from './settings';

function moduleDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Design',
        settings: [
          bgcolor(),
        ],
      },
      {
        groupLabel: 'Padding (px)',
        settings: [
          padding({
            aclName: 'padding_padding',
            noLabel: true,
          }),
        ],
      },
      {
        groupLabel: 'Border',
        settings: [
          borderGroup(),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          classes(),
        ],
      },
    ],
  };
}


module.exports = moduleDefault;
