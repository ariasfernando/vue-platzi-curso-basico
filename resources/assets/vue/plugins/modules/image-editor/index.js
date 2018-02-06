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
  config: {
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
    fileTypes: {
      label: 'File Types',
      key: 'fileTypes',
      value: 'image/*',
      type: 'text',
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
    adjustableWidth: {
      label: 'Width Control',
      key: 'adjustableWidth',
      value: false,
      type: 'switch',
    },
    maxWidth: {
      label: 'Max width',
      key: 'maxWidth',
      value: '600',
      type: 'text',
      hint: 'Applies when width control is enabled',
    },
    minWidth: {
      label: 'Min width',
      key: 'minWidth',
      value: '20',
      type: 'text',
      hint: 'Applies when width control is enabled',
    },
    adjustableHeight: {
      label: 'Height Control',
      key: 'adjustableHeight',
      value: false,
      type: 'switch',
    },
    maxHeight: {
      label: 'Max Height',
      key: 'maxHeight',
      value: '600',
      type: 'text',
      hint: 'Applies when height control is enabled',
    },
    minHeight: {
      label: 'Min Height',
      key: 'minHeight',
      value: '20',
      type: 'text',
      hint: 'Applies when width control is enabled',
    },
    disableZoom: {
      label: 'Disable Zoom',
      key: 'disableZoom',
      value: false,
      type: 'switch',
    },
    library: {
      label: 'Library',
      key: 'library',
      value: '',
      type: 'select',
      options: []
    },
    sticker: {
      label: 'Sticker',
      key: 'sticker',
      value: false,
      type: 'switch',
      config: {
        path: {
          label: 'Path',
          key: 'path',
          value: '',
          type: 'text',
        },
        class: {
          label: 'Class',
          key: 'class',
          value: '',
          type: 'text',
        },
        width: {
          label: 'Width',
          key: 'width',
          value: '',
          type: 'text',
        },
        height: {
          label: 'Height',
          key: 'height',
          value: '',
          type: 'text',
        },
        padding: {
          label: 'Padding',
          key: 'padding',
          value: '',
          type: 'text',
        },
        horizontalAlignment: {
          label: 'Align X',
          key: 'horizontalAlignment',
          value: ['left', 'right'],
          options: ['left', 'right'],
          type: 'multi-select',
        },
        verticalAlignment: {
          label: 'Align Y',
          key: 'verticalAlignment',
          value: ['top', 'bottom'],
          options: ['top', 'bottom'],
          type: 'multi-select',
        },
      },
    },
  },
  data: {},
  enabled: false,
};
