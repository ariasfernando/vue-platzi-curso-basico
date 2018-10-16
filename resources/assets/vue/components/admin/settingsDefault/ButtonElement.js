function buttonDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Font Settings',
        settings:
          [{
            name: 'fontFamily',
            type: 'font-family',
            aclName: 'font_font-family',
            link: 'style',
            label: 'Font Family',
            subComponent: 'button',
          },
          {
            name: 'fontSize',
            type: 'generic-number',
            aclName: 'font_font-style',
            isPixel: true,
            subComponent: 'button',
            link: 'style',
            label: 'Font size',
          },
          {
            name: 'lineHeight',
            label: 'Line height',
            type: 'generic-number',
            aclName: 'font_font-style',
            isPercentage: true,
            maxPercentage: 200,
            subComponent: 'button',
            link: 'style',
          },
          {
            name: 'letter-spacing',
            aclName: 'font_letter-spacing',
            type: 'letter-spacing',
            subComponent: 'button',
          },
          {
            name: 'font-weight',
            aclName: 'font_font-weight',
            type: 'font-weight',
            subComponent: 'button',
          }],
      },
      {
        groupLabel: 'Text Alignment',
        settings: [{
          name: 'text-align',
          aclName: 'textAlignment_text-align',
          type: 'text-align',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Classes and Style',
        settings: [
          {
            name: 'classes',
            type: 'class-input',
            aclName: 'style_classes',
            link: 'attribute',
            subComponent: 'container',
          },
          {
            name: 'bgcolor',
            type: 'generic-color',
            aclName: 'style_bgcolor',
            link: 'attribute',
            label: 'Background Color',
            subComponent: 'button',
          },
          {
            name: 'color',
            type: 'generic-color',
            aclName: 'style_generic-color',
            link: 'style',
            label: 'Text Color',
            subComponent: 'button',
          }],
      },
      {
        groupLabel: 'Padding and Border radius',
        settings: [{
          name: 'padding',
          type: 'padding-group',
          aclName: 'style_padding',
          subComponent: 'container',
          label: 'Element Padding',
        },
        {
          link: 'style',
          label: 'Border radius',
          name: 'borderRadius',
          aclName: 'style_border-radius',
          isPixel: true,
          type: 'generic-number',
          subComponent: 'button',
        }],
      },
      {
        groupLabel: 'Border',
        settings: [{
          name: 'border-group',
          aclName: 'border_border-group',
          type: 'border-group',
          subComponent: 'button',
        }],
      },
      {
        groupLabel: 'Dimentions',
        settings: [{
          link: 'attribute',
          label: 'Width',
          name: 'width',
          aclName: 'dimentions_width',
          type: 'generic-number',
          value: 150,
          subComponent: 'button',
        },
        {
          link: 'attribute',
          label: 'Height',
          name: 'height',
          aclName: 'dimentions_height',
          type: 'generic-number',
          value: 40,
          minValue: 5,
          subComponent: 'button',
        }],
      },
      {
        groupLabel: 'Default URL',
        settings: [{
          link: 'attribute',
          label: 'Default URL',
          name: 'href',
          aclName: 'url_href',
          type: 'generic-text',
          value: '',
          subComponent: 'button',
        }],
      },
      {
        groupLabel: 'Caret',
        settings: [{
          name: 'caret',
          aclName: 'caret_caret',
          type: 'caret',
          subComponent: 'caret',
        },
        {
          name: 'image-size',
          aclName: 'caret_image-size',
          type: 'image-size',
          minValue: 5,
          subComponent: 'caret',
          isDisablePercentage: true,
        },
        {
          name: 'classes',
          aclName: 'caret_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'caret',
        },
        {
          name: 'bgcolor',
          aclName: 'caret_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'caret',
        },
        {
          name: 'padding',
          aclName: 'caret_padding',
          type: 'padding-group',
          subComponent: 'caret',
          label: 'Caret Padding',
        }],
      },
    ],
  };
}


module.exports = buttonDefault;
