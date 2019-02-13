function columnDefault() {
  return {
    componentSettings: [
      {
        settings: [{
          name: 'bgcolor',
          aclName: 'background_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        }],
      },
      {
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Padding',
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
      {
        settings: [{
          link: 'attribute',
          label: 'Width',
          name: 'width',
          aclName: 'style_width',
          type: 'width',
          subComponent: 'container',
        },
        {
          name: 'classes',
          aclName: 'style_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
    ],
  };
}

module.exports = columnDefault;
