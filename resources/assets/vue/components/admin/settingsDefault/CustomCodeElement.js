function codeDefault() {
  return {
    componentSettings: [
      {
        groupName: 'customCodeGeneralSettingsGroup',
        groupLabel: 'Settings',
        settings: [{
          label: 'Edit Code',
          name: 'data',
          type: 'generic-code',
          subComponent: 'code',
        },
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
          subComponent: 'container',
        },
        {
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
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


module.exports = codeDefault;
