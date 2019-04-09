const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'custom-toggle-increment',
  title: 'Visible Items',
  version: '1.0.0',
  author: 'elias.torres@stensul.com',
  target: ['module'],
  campaignSettings,
  config: {
    wrapper: {
      id: 'row_or_column_id_here',
      // label: 'Social Icons Row', ->  label for toggle button
      // toggleable: true, -> show toggle button
      // hideIfEmpty: false, -> hide (row/column) when visibleCounter is 0, default is true
    },
    items: {
      min: 0, // -> StuiInputNumber option
      max: 4, // -> StuiInputNumber option
      // label: 'Social Icons Amount', ->  Label for the input
      // step: 2, -> StuiInputNumber option
      // snap: 2, -> StuiInputNumber option
    },
  },
  data: {
    visibleCounter: 4,
  },
  render: true,
  enabled: false,
};
