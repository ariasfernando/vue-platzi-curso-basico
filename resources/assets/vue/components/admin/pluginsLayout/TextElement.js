function textDefault() {
  return {
    componentPlugins: [
      {
        groupLabel: '',
        showLabel: false,
        plugins: [{
          name: 'alignment',
          title: 'Alignment',
          aclName: 'alignment',
        }],
      },
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
        groupLabel: 'Destination URL',
        showLabel: false,
        plugins:
        [
          {
            name: 'destination-url',
            title: 'Destination URL',
            aclName: 'destination-url',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
        plugins: [
          {
            name: 'font-family',
            title: 'Font family',
            aclName: 'font-family',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
        plugins: [
          {
            name: 'text-options',
            title: 'Text Editable',
            aclName: 'text-options',
          },
        ],
      },
      {
        groupLabel: '',
        showLabel: false,
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

module.exports = textDefault;
