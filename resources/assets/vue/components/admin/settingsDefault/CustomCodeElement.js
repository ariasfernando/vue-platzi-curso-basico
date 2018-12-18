function codeDefault() {
  return {
    componentSettings: [
      {
        settings: [{
          label: 'Edit Code',
          name: 'data',
          aclName: 'settings_data',
          type: 'generic-code',
          subComponent: 'code',
        },
        {
          name: 'classes',
          aclName: 'settings_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        },
        {
          name: 'bgcolor',
          aclName: 'settings_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'padding',
          aclName: 'settings_padding',
          type: 'padding-group',
          subComponent: 'container',
        }],
      },
      {
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
          subComponent: 'container',
        }],
      },
    ],
  };
}


module.exports = codeDefault;
