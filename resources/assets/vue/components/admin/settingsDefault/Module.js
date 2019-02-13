function moduleDefault() {
  return {
    componentSettings: [
      {
        settings: [{
          name: 'bgcolor',
          aclName: 'background_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        }],
      },
      {
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          label: 'Padding',
        }],
      },
      {
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
        }],
      },
      {
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
