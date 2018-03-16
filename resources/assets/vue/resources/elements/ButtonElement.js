function buttonDefault() {
  return {
    type: 'button-element',
    data: {
      text: 'Lorem ipsum',
    },
    style: {
      textAlign: 'center',
      fontFamily: 'Helvetica, Arial, Sans-serif',
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      // Warning: line-height affects vertical alignment
      lineHeight: '14px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingRight: '0px',
      paddingLeft: '0px',
      // Border Top
      borderTopWidth: '0px',
      borderTopStyle: 'none',
      borderTopColor: '',
      // Border Right
      borderRightWidth: '0px',
      borderRightStyle: 'none',
      borderRightColor: '',
      // Border Bottom
      borderBottomWidth: '0px',
      borderBottomStyle: 'none',
      borderBottomColor: '',
      // Border Left
      borderLeftWidth: '0px',
      borderLeftStyle: 'none',
      borderLeftColor: '',
    },
    styleOptions: {
      isBlockLineHeight: false,
      isCustomFontWeight: false,
      isNormalLetterSpacing: true,
    },
    attribute: {
      width: '150',
      height: '40',
      align: 'center',
      valign: 'middle',
      bgcolor: '#514960',
      href: 'http://stensul.com',
      target: '_blank',
      classes: '',
    },
    buttonCaret: {
      attribute: {
        url: undefined,
        width: '10',
        height: '10',
        align: undefined,
        valign: 'middle',
        bgcolor: '',
        classes: '',
      },
      style: {
        paddingTop: '0',
        paddingBottom: '0',
        paddingRight: '0',
        paddingLeft: '0',
      },
      styleOptions: {
        isBlockHeight: false,
        isPxWidth: true,
      },
    },
    componentSettings: [
      [
        {
          name: 'fontFamily',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
        },
        {
          name: 'font-style',
          type: 'font-style',
        },
        {
          name: 'letter-spacing',
          type: 'letter-spacing',
        },
        {
          name: 'font-weight',
          type: 'font-weight',
        },
      ],
      [
        {
          name: 'text-align',
          type: 'text-align',
        },
        {
          name: 'vertical-align',
          type: 'vertical-align',
        },
      ],
      [
        {
          name: 'button-caret',
          type: 'button-caret',
        },
        {
          name: 'image-size',
          type: 'image-size',
          subComponent: 'buttonCaret',
          minValue: 5,
        },
        {
          name: 'text-align',
          type: 'text-align',
          subComponent: 'buttonCaret',
        },
        {
          name: 'vertical-align',
          type: 'vertical-align',
          subComponent: 'buttonCaret',
        },
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'buttonCaret',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'buttonCaret',
        },
        {
          name: 'padding',
          type: 'padding',
          subComponent: 'buttonCaret',
        },
      ],
      [
        {
          name: 'classes',
          type: 'class-input',
          link: 'attribute',
        },
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
        {
          name: 'color',
          type: 'generic-color',
          link: 'style',
          label: 'Color',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
        },
        {
          name: 'border-group',
          type: 'border-group',
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Width',
          name: 'width',
          type: 'generic-number',
          value: 150,
          minValue: 5,
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
        },
      ],
      [
        {
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          type: 'generic-text',
          value: 'http://stensul.com',
        },
      ],
    ],
    settings: [],
    plugins: {},
  };
}


module.exports = buttonDefault;
