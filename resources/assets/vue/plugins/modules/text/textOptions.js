
let plugin = {
  id: 'text-options',
  name: 'Text Options',
  studio: {
    fields: [
      {
        label: 'Max length',
        name: 'maxLength',
        type: 'text',
        value: 100
      },
      {
        label: 'Max lines',
        name: 'maxLines',
        type: 'text',
        value: 10
      },
    ],
    init(v) {
      console.log('[InitPlugin] Text Options');
    },
  },
  campaign: {},
};

module.exports = plugin;