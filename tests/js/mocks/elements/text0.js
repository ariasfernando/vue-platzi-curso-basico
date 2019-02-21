import {
  alignment,
  backgroundColor,
  destinationUrl,
  fontFamily,
  mobileStyles,
  paletteBackgroundColor,
  textOptions,
  toggleElementSetter,
} from '../plugins/modules';

export default {
  id: 844757,
  type: 'text-element',
  data: {
    text: '<p style="margin: 0px;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>',
  },
  container: {
    style: {
      paddingTop: '5px',
      paddingBottom: '5px',
      paddingRight: '5px',
      paddingLeft: '5px',
    },
    styleOption: {
      enableElement: true,
    },
    attribute: [],
  },
  text: {
    style: {
      fontFamily: 'Helvetica, Arial, Sans-serif',
      fontSize: '12px',
      color: '#000000',
      fontWeight: 'normal',
      lineHeight: '20%',
      align: 'left',
    },
    styleOption: {
      isNormalLetterSpacing: false,
    },
    attribute: {
      href: '',
    },
  },
  plugins: {
    alignment,
    backgroundColor,
    destinationUrl,
    fontFamily,
    mobileStyles,
    paletteBackgroundColor,
    textOptions,
    toggleElementSetter,
  },
};
