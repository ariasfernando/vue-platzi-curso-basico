function moduleDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins: [
          {
            name: 'module-background-color',
            title: 'Background color',
            aclName: 'module-background-color',
          },
          {
            name: 'module-palette-background-color',
            title: 'Palette Background color',
            aclName: 'module-palette-background-color',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'module-equal-height-for-column',
            title: 'Equal Height',
            aclName: 'module-equal-height-for-column',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'text-color-by-background-for-module',
            title: 'Text Color by Background',
            aclName: 'text-color-by-background-for-module',
          },
        ],
      },
    ],
  };
}

module.exports = moduleDefault;
