function dividerDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins: [
          {
            name: 'background-color',
            title: 'Background color',
            aclName: 'background-color',
          },
          {
            name: 'palette-background-color',
            title: 'Palette Background color',
            aclName: 'palette-background-color',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'toggle-element-setter',
            title: 'Toggle element',
            aclName: 'toggle-element-setter',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'variable-height',
            title: 'Height',
            aclName: 'variable-height',
          },
        ],
      },
    ],
  };
}

module.exports = dividerDefault;
