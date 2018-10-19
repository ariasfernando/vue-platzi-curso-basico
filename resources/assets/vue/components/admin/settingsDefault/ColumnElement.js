function columnDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Background Color',
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
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Padding',
        }],
      },
      {
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Width and Class',
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
