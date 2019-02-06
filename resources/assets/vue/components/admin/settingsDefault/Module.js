function moduleDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Background color',
        showLabel: false,
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
        showLabel: false,
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          label: 'Padding',
        }],
      },
      {
        groupLabel: 'Border',
        showLabel: false,
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
        }],
      },
      {
        groupLabel: 'Class and stacking group',
        showLabel: false,
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
