function buttonDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: 'Background',
        showLabel: true,
        plugins: [
          {
            name: 'background-color',
            title: 'background Color',
            aclName: 'background-color',
          },
          {
            name: 'palette-background-color',
            title: 'palette Background Color',
            aclName: 'palette-background-color',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'alignment',
            title: 'Alignment',
            aclName: 'alignment',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'destination-url',
            title: 'Destination URL',
            aclName: 'destination-url',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'font-family',
            title: 'Font family',
            aclName: 'font-family',
          },
        ],
      },
      {
        plugins: [
          {
            name: 'text-options',
            title: 'Text Editable',
            aclName: 'text-options',
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
    ],
  };
}

module.exports = buttonDefault;
