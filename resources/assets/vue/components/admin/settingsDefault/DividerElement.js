function dividerDefault() {
  return {
    componentSettings: [
      {
        groupName: 'classesGroup',
        groupLabel: 'Classes',
        settings: [{
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupName: 'StyleSettingsGroup',
        groupLabel: 'Style settings',
        settings: [{
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Inner Background Color',
          subComponent: 'divider',
        },
        {
          link: 'style',
          label: 'Height',
          name: 'height',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'divider',
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
      {
        groupName: 'borderGroup',
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          type: 'border-group',
          subComponent: 'container',
        }],
      },
    ],
  };
}

module.exports = dividerDefault;
