import {
  alignment,
  backgroundColor,
  destinationUrl,
  maskLink,
  mobileStyles,
  paletteBackgroundColor,
  styleImageEditor,
  toggleElementSetter,
} from '../plugins/modules';

export default {
  id: 4762132,
  type: 'image-element',
  container: {
    style: [],
    styleOption: {
      enableElement: true,
    },
    attribute: [],
  },
  image: {
    attribute: {
      placeholder: '',
      href: '',
      width: '100%',
      height: 'auto',
      alt: 'Image',
    },
    style: [],
    styleOption: {
      noMobileStretch: true,
      isBlockHeight: false,
      isPxWidth: false,
    },
  },
  plugins: {
    alignment,
    backgroundColor,
    destinationUrl,
    maskLink,
    mobileStyles,
    paletteBackgroundColor,
    styleImageEditor,
    toggleElementSetter,
  },
  data: [],
};
