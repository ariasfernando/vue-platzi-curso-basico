const studioSettings = require('./studioSettings.vue');
const campaignSettings = require('./campaignSettings.vue');

module.exports = {
  name: 'image-editor',
  title: 'Image Editor',
  version: '0.0.1',
  author: 'emiliano@stensul.com',
  target: ['image'],
  studioSettings,
  campaignSettings,
  data: {
    options: {
      preventWhiteSpace: {
        label: 'Prevent white space',
        key: 'preventWhiteSpace',
        value: false,
        type: 'switch',
      },
      disableScroll: {
        label: 'Disable Scroll',
        key: 'disableScroll',
        value: false,
        type: 'switch',
      },
      width: {
        label: 'Width',
        key: 'width',
        value: 600,
        type: 'text',
      },
      height: {
        label: 'Height',
        key: 'height',
        value: 200,
        type: 'text',
      },
      quality: {
        label: 'Retina Display',
        key: 'quality',
        value: false,
        type: 'switch',
      },
      initialSize: {
        label: 'Initial Size',
        key: 'initialSize',
        value: 'cover',
        type: 'text',
        hint: "Available values are: 'cover', 'contain', 'natural'",
      },
      initialPosition: {
        label: 'Initial Position',
        key: 'initialPosition',
        value: 'center',
        hint: "Available values are: 'center', 'top', 'bottom', 'left'. " +
              "Also you can make a composition of the given values ('top left', 'right top') " +
              "as well as percentage values ('30% 40%')",
        type: 'text',
      },
      disableDrag: {
        label: 'Disable Drag',
        key: 'disableDrag',
        value: false,
        type: 'switch',
      },
      adjustableWidth: {
        label: 'Width Control',
        key: 'adjustableWidth',
        value: false,
        type: 'switch',
      },
      adjustableHeight: {
        label: 'Height Control',
        key: 'adjustableHeight',
        value: false,
        type: 'switch',
      },
      disableZoom: {
        label: 'Disable Zoom',
        key: 'disableZoom',
        value: false,
        type: 'switch',
      },
    },
  },
  enabled: false,
};
