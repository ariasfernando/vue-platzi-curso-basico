import studioSettings from './studioSettings.vue';
import campaignSettings from './campaignSettings.vue';

export default {
  name: 'style-image-editor',
  title: 'Style Image Editor',
  version: '0.0.1',
  author: 'manuel.zambrano@stensul.com',
  target: ['image'],
  studioSettings,
  campaignSettings,
  config: {
    library: {
      label: 'Media Gallery',
      key: 'media_gallery',
      type: 'switch',
      value: false,
      config: {
        set_images: {
          label: 'Image Set',
          key: 'set_images',
          value: null,
          type: 'select',
          options: []
        }
      }
    },
    mobile: {
      label: 'Mobile Upload',
      key: 'mobile_upload',
      value: false,
      type: 'switch'
    },
    url: {
      label: 'Url Upload',
      key: 'url_upload',
      value: false,
      type: 'switch'
    },
    size: {
      label: 'Size',
      key: 'size',
      type: 'label',
      value: true,
      config: {
        size_width: {
          label: 'Width',
          key: 'width',
          value: 600,
          type: 'number',
        },
        size_height: {
          label: 'Height',
          key: 'height',
          value: 200,
          type: 'number',
          step: 1
        },
      },
    },
    'sie-plugin-image_upload': {
      label: 'Upload',
      key: 'upload',
      type: 'label',
      value: true,
      config: {
        uploaddefault: {
          label: 'Default image',
          key: 'url',
          value: '',
          type: 'text',
        },
        fillcolor: {
          label: 'Background color',
          key: 'fillColor',
          value: '#000000',
          type: 'text',
        },
      },
    },
    'sie-plugin-image_cropper': {
      label: 'Cropper',
      key: 'cropper',
      type: 'switch',
      value: false,
      config: {
        movable: {
          label: 'Enable Drag',
          key: 'movable',
          value: true,
          type: 'switch',
        },
        rotatable: {
          label: 'Enable rotation',
          key: 'rotatable',
          value: false,
          type: 'switch',
        },
        zoomable: {
          label: 'Enable zoom',
          key: 'zoomable',
          value: true,
          type: 'switch',
        },
      },
    },
    'sie-plugin-text_text': {
      label: 'Text',
      key: 'text',
      value: false,
      type: 'switch',
      config: {
        text_visible: {
          label: 'Visible',
          key: 'visible',
          value: true,
          type: 'switch',
        },
        text_default: {
          label: 'Default text',
          key: 'default',
          value: 'Lorem ipsum sit dolom',
          type: 'text',
        },
        text_description: {
          label: 'Description',
          key: 'description',
          value: 'Text',
          type: 'text',
        },
        text_top: {
          label: 'Top',
          key: 'top',
          value: 0,
          type: 'number',
          step: 1
        },
        text_left: {
          label: 'Left',
          key: 'left',
          value: 0,
          type: 'number',
          step: 1
        },
      },
    },
    'sie-plugin-image-overlay_image': {
      label: 'Image Overlay',
      key: 'image',
      value: false,
      type: 'switch',
      config: {
        overlay_visible: {
          label: 'Visible',
          key: 'visible',
          value: true,
          type: 'switch',
        },
        overlay_default: {
          label: 'Default image',
          key: 'url',
          value: '',
          type: 'text',
        },
        overlay_width: {
          label: 'Width',
          key: 'width',
          value: 100,
          type: 'number',
          step: 1
        },
        overlay_height: {
          label: 'Height',
          key: 'height',
          value: 100,
          type: 'number',
          step: 1
        },
        overlay_top: {
          label: 'Top',
          key: 'top',
          value: 0,
          type: 'number',
          step: 1
        },
        overlay_left: {
          label: 'Left',
          key: 'left',
          value: 0,
          type: 'number',
          step: 1
        },
      },
    },
    'sie-plugin-shapemask_options': {
      label: 'Shapemask',
      key: 'shapemask',
      value: true,
      type: 'switch',
      config: {
        shapemask_visible: {
          label: 'Visible',
          key: 'visible',
          value: false,
          type: 'switch',
        },
        transparencycolor: {
          label: 'Fill color',
          key: 'transparencyColor',
          value: '#000000',
          type: 'text',
        },
        transparency: {
          label: 'Transparency',
          key: 'transparency',
          value: 1,
          max: 1, 
          min: 0,
          step: 1,
          type: 'number',
        },
        shapemask_square: {
          label: 'Square',
          key: 'shapes_square',
          type: 'switch',
          value: false,
          config: {
            square_width: {
              label: 'Width',
              key: 'width',
              value: 0,
              type: 'number',
              step: 1
            },
            square_height: {
              label: 'Height',
              key: 'height',
              value: 0,
              type: 'number',
              step: 1
            },
            square_top: {
              label: 'Top',
              key: 'top',
              value: 0,
              type: 'number',
              step: 1
            },
            square_left: {
              label: 'Left',
              key: 'left',
              value: 0,
              type: 'number',
              step: 1
            },
            square_description: {
              label: 'Description',
              key: 'description',
              type: 'text',
              value: 'Square',
            },
            square_icon: {
              label: 'Icon',
              key: 'icon',
              type: 'text',
              value: 'far fa-square',
            },
          },
        },
        shapemask_circle: {
          label: 'Circle',
          key: 'shapes_circle',
          type: 'switch',
          value: false,
          config: {
            circle_radius: {
              label: 'Radius',
              key: 'radius',
              value: 0,
              type: 'number',
              step: 1
            },
            circle_top: {
              label: 'Top',
              key: 'top',
              value: 0,
              type: 'number',
              step: 1
            },
            circle_left: {
              label: 'Left',
              key: 'left',
              value: 0,
              type: 'number',
              step: 1
            },
            circle_description: {
              label: 'Description',
              key: 'description',
              type: 'text',
              value: 'Circle',
            },
            circle_icon: {
              label: 'Icon',
              key: 'icon',
              type: 'text',
              value: 'far fa-circle',
            },
          },
        },
      },
    },
  },
  data: {},
  enabled: false,
  settings: true
};