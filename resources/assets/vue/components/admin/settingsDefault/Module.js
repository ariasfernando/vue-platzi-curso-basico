function moduleDefault() {
  return {
    componentSettings: [
      {
        groupName: 'backgroundColorGroup',
        groupLabel: 'Background color',
        settings: [{
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        }],
      },
      {
        groupName: 'paddingGroup',
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          label: 'Padding',
        }],
      },
      {
        groupName: 'borderGroup',
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          type: 'border-group',
        }],
      },
      {
        groupName: 'classesAndColumnStackingGroup',
        groupLabel: 'Class and stacking group',
        settings: [{
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
        {
          name: 'columnsStacking',
          type: 'columns-stacking',
        }],
      },
    ],
  };
}


module.exports = moduleDefault;
