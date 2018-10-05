function columnDefault() {
  return {
    componentSettings: [
      {
        groupName: 'backgroundColorGroup',
        groupLabel: 'Background Color',
        settings: [{
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        }],
      },
      {
        groupName: 'paddingGroup',
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Padding',
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
      {
        groupName: 'widthAndClassGroup',
        groupLabel: 'Width and Class',
        settings: [{
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'width',
          subComponent: 'container',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
    ],
  };
}

module.exports = columnDefault;
