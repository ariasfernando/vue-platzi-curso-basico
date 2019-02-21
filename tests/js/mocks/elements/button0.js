import {
  alignment,
  backgroundColor,
  destinationUrl,
  fontFamily,
  maskLink,
  mobileStyles,
  paletteBackgroundColor,
  textOptions,
  toggleElementSetter,
} from '../plugins/modules';

export default {
  id: 301362,
  type: 'button-element',
  data: {
    text: '<p style="color: rgb(255, 255, 255); margin: 0px;">Lorem ipsum</p>',
  },
  container: {
    style: [],
    styleOption: {
      enableElement: true,
    },
    attribute: {
      align: 'center',
    },
  },
  button: {
    style: {
      color: '#FFFFFF',
      fontFamily: 'Helvetica, Arial, Sans-serif',
      fontSize: '12px',
      lineHeight: '20%',
      textAlign: 'center',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      paddingLeft: '15px',
      paddingRight: '15px',
    },
    styleOption: {
      isNormalLetterSpacing: false,
    },
    attribute: {
      width: '150',
      height: '40',
      align: 'center',
      bgcolor: '#514960',
      href: '',
      title: '',
      valign: 'middle',
    },
  },
  caret: {
    attribute: {
      width: '10',
      height: '10',
      valign: 'middle',
    },
    style: [],
    styleOption: [],
  },
  plugins: {
    alignment,
    backgroundColor,
    destinationUrl,
    fontFamily,
    maskLink,
    mobileStyles,
    paletteBackgroundColor,
    textOptions,
    toggleElementSetter,
  },
};
