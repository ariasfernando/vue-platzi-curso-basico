import {
  bgcolor,
  borderGroup,
  borderRadius,
  classes,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  height,
  href,
  letterSpacing,
  lineHeight,
  padding,
  textAlign,
  width,
} from './settings';

function buttonDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Font',
        settings: [
          fontFamily({ subComponent: 'button' }),
          fontSize({ subComponent: 'button' }),
          lineHeight({ subComponent: 'button' }),
          letterSpacing({ subComponent: 'button', checkbox: true }),
          fontWeight({ subComponent: 'button' }),
        ],
      },
      {
        groupLabel: 'Design',
        settings: [
          color({ subComponent: 'button', aclName: 'style_generic-color' }),
          bgcolor({ subComponent: 'button', aclName: 'style_bgcolor' }),
          borderRadius({ subComponent: 'button' }),
          textAlign({ subComponent: 'container' }),
        ],
      },
      {
        groupLabel: 'Dimensions',
        settings: [
          width({
            subComponent: 'button',
            aclName: 'dimentions_width',
            type: 'button-width',
            checkbox: true,
            value: 150,
          }),
          height({
            subComponent: 'button',
            aclName: 'dimentions_height',
            value: 40,
            minValue: 5,
          }),
        ],
      },
      {
        groupLabel: 'Padding',
        settings: [
          padding({ subComponent: 'container', label: 'Container (px)' }),
          padding({ subComponent: 'button' }),
        ],
      },
      {
        groupLabel: 'Border',
        settings: [
          borderGroup({ subComponent: 'button' }),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          href({ subComponent: 'button' }),
          classes({ subComponent: 'container' }),
        ],
      },
    ],
  };
}


module.exports = buttonDefault;
