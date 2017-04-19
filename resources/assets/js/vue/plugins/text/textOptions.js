
let plugin = {
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
  init( Vue ) {
    console.log(Vue)
  },

};

module.exports = plugin;