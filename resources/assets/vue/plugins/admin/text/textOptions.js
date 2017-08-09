
let plugin = {
  id: 'text-options',
  name: 'Text Options',
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
    }
  ],
  init(v) {
    console.log('[InitPlugin] Text Options');
  },

};

module.exports = plugin;