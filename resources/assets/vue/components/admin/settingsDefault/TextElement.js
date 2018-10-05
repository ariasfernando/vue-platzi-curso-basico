function textDefault() {
  return {
    componentSettings: [
      {
        groupName: 'fontFamilyGroup',
        groupLabel: 'Font Family',
        settings: [{
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'text',
        }],
      },
      {
        groupName: 'fontAndStylesGroup',
        groupLabel: 'Font and styles',
        settings: [{
          name: 'font-style',
          type: 'font-style',
          subComponent: 'text',
        },
        {
          name: 'letterSpacing',
          type: 'letter-spacing',
          subComponent: 'text',
        },
        {
          name: 'fontWeight',
          type: 'font-weight',
          subComponent: 'text',
        },
        {
          name: 'align',
          type: 'text-align',
          subComponent: 'text',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupName: 'colorStyles',
        groupLabel: 'Color',
        settings: [{
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Color',
          subComponent: 'text',
        }],
      },
      {
        groupName: 'paddingGroup',
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
    ],
  };
}

module.exports = textDefault;
