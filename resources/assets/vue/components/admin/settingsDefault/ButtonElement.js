function buttonDefault() {
  return {
    componentSettings: [
      {
        groupName: 'fontSettingsGroup',
        groupLabel: 'Font Settings',
        settings:
          [{
            name: 'fontFamily',
            type: 'font-family',
            link: 'style',
            label: 'Font Family',
            subComponent: 'button',
          },
          {
            name: 'font-style',
            type: 'font-style',
            subComponent: 'button',
          },
          {
            name: 'letter-spacing',
            type: 'letter-spacing',
            subComponent: 'button',
          },
          {
            name: 'font-weight',
            type: 'font-weight',
            subComponent: 'button',
          }],
      },
      {
        groupName: 'textAlignmentGroup',
        groupLabel: 'Text Alignment',
        settings: [{
          name: 'text-align',
          type: 'text-align',
          subComponent: 'container',
        }],
      },
      {
        groupName: 'classStyleGroup',
        groupLabel: 'Classes and Style',
        settings: [
          {
            name: 'classes',
            type: 'class-input',
            link: 'attribute',
            subComponent: 'container',
          },
          {
            name: 'bgcolor',
            type: 'generic-color',
            link: 'attribute',
            label: 'Background Color',
            subComponent: 'button',
          },
          {
            name: 'color',
            type: 'generic-color',
            link: 'style',
            label: 'Text Color',
            subComponent: 'button',
          }],
      },
      {
        groupName: 'paddingBorderRadiusGroup',
        groupLabel: 'Padding and Border radius',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        },
        {
          link: 'style',
          label: 'Border radius',
          name: 'borderRadius',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'button',
        }],
      },
      {
        groupName: 'borderGroup',
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          type: 'border-group',
          subComponent: 'button',
        }],
      },
      {
        groupName: 'dimentionsGroup',
        groupLabel: 'Dimentions',
        settings: [{
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'generic-number',
          value: 150,
          subComponent: 'button',
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
          subComponent: 'button',
        }],
      },
      {
        groupName: 'defaultUrlGroup',
        groupLabel: 'Default URL',
        settings: [{
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: '',
          subComponent: 'button',
        }],
      },
      {
        groupName: 'caretGroup',
        groupLabel: 'Default URL',
        settings: [{
          name: 'caret',
          type: 'caret',
          subComponent: 'caret',
        },
        {
          name: 'image-size',
          type: 'image-size',
          minValue: 5,
          subComponent: 'caret',
          isDisablePercentage: true,
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'caret',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'caret',
        },
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'caret',
          label: 'Caret Padding',
        }],
      },
    ],
  };
}


module.exports = buttonDefault;
