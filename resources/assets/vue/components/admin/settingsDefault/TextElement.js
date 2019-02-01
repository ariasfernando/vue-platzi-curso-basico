import {
  bgcolor,
  classes,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  href,
  letterSpacing,
  lineHeight,
  padding,
} from './settings';

function textDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Font',
        settings: [
          fontFamily({ subComponent: 'text' }),
          fontSize({ subComponent: 'text' }),
          lineHeight({ subComponent: 'text' }),
          letterSpacing({
            subComponent: 'text',
            checkbox: true,
            defaultValue: 0.2,
            falseText: 'normal',
            valueOnFalse: 'normal',
          }),
          fontWeight({ subComponent: 'text' }),
        ],
      },
      {
        groupLabel: 'Design',
        settings: [
          color({ subComponent: 'text', aclName: 'styles_color' }),
          bgcolor({ subComponent: 'container', aclName: 'styles_bgcolor' }),
        ],
      },
      {
        groupLabel: 'Padding',
        settings: [
          padding({ subComponent: 'container' }),
        ],
      },
      {
        groupLabel: 'Behavior',
        settings: [
          href({ subComponent: 'text', aclName: 'font_font-style' }),
          classes({ subComponent: 'container', aclName: 'font_classes' }),
        ],
      },
    ],
  };
}

module.exports = textDefault;
