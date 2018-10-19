function moduleDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Background color',
        settings: [{
          name: 'bgcolor',
          aclName: 'background_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        }],
      },
      {
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          label: 'Padding',
        }],
      },
      {
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
        }],
      },
      {
        groupLabel: 'Class and stacking group',
        settings: [{
          name: 'classes',
          aclName: 'style_classes',
          type: 'class-input',
          link: 'attribute',
        },
        {
          name: 'columnsStacking',
          aclName: 'stacking_column-stacking',
          type: 'columns-stacking',
        }],
      },
    ],
  };
}


module.exports = moduleDefault;
