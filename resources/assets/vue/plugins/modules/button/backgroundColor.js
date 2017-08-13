let plugin = {
  id: 'backgroundColor',
  name: 'Background color',
  enabled: true,
  studio: {
    fields: [
      {
        label: 'Background color',
        name: 'backgroundColor',
        type: 'switch',
        value: true,
      },
    ],
    init(v) {
      console.log('[InitPlugin] Background Color');
    },
  },
  campaign: {
    fields: {
      backgroundColor: {
        label: 'Background color',
        attribute: 'bgcolor',
        type: 'color',
        value: '#514960',
      },
    },
    init(v) {
      console.log('[InitPlugin] Background Color');
    },
  },
};

module.exports = plugin;
