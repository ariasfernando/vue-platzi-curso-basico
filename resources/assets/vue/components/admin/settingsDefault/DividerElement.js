import {
  bgcolor,
  borderGroup,
  classes,
  height,
  width,
  padding,
  textAlign,
} from './settings';

function dividerDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Design',
        settings: [
          bgcolor({
            subComponent: 'container',
            aclName: 'style_bgcolor',
          }),
          bgcolor({
            subComponent: 'divider',
            aclName: 'style_inner-bgcolor',
            label: 'Divider Color',
          }),
          bgcolor({
            subComponent: 'divider',
            aclName: 'style_inner-bgcolor_advanced',
            label: 'Divider Color',
          }),
          width({
            subComponent: 'divider',
            aclName: 'style_height',
            isPercentage: true,
          }),
          height({
            subComponent: 'divider',
            link: 'style',
            isPixel: true,
          }),
          textAlign({
            subComponent: 'divider',
            aclName: 'style_height',
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
        groupLabel: 'Behavior',
        settings: [
          classes({
            subComponent: 'container',
            aclName: 'classes_classes',
          }),
        ],
      },
    ],
  };
}

module.exports = dividerDefault;
