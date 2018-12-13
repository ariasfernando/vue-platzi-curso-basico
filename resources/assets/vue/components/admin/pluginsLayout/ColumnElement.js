function columnDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins: [
          {
            name: 'column-background-color',
            title: 'Background color',
            aclName: 'column-background-color',
          },
          {
            name: 'column-palette-background-color',
            title: 'Palette background color',
            aclName: 'column-palette-background-color',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'text-color-by-background',
            title: 'Text Color by Background',
            aclName: 'text-color-by-background',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'vertical-alignment',
            title: 'Vertical alignment',
            aclName: 'vertical-alignment',
          },
        ],
      },
    ],
  };
}

module.exports = columnDefault;
