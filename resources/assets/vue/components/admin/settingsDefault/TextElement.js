function textDefault() {
  return {
    componentSettings: [
      {
        groupLabel: 'Font Family',
        settings: [{
          name: 'fontFamily',
          aclName: 'font_font-family',
          type: 'font-family',
          link: 'style',
          label: 'Font Family',
          subComponent: 'text',
        }],
      },
      {
        groupLabel: 'Font and styles',
        settings: [{
          name: 'font-style',
          aclName: 'font_font-style',
          type: 'font-style',
          subComponent: 'text',
        },
        {
          name: 'letterSpacing',
          aclName: 'font_letter-spacing',
          type: 'letter-spacing',
          subComponent: 'text',
        },
        {
          name: 'fontWeight',
          aclName: 'font_font-weight',
          type: 'font-weight',
          subComponent: 'text',
        },
        {
          name: 'align',
          aclName: 'font_align',
          type: 'text-align',
          subComponent: 'text',
        },
        {
          name: 'classes',
          aclName: 'font_classes',
          type: 'class-input',
          link: 'attribute',
          subComponent: 'container',
        }],
      },
      {
        groupLabel: 'Color',
        settings: [{
          name: 'bgcolor',
          aclName: 'styles_bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
          subComponent: 'container',
        },
        {
          name: 'color',
          aclName: 'styles_color',
          type: 'generic-color',
          link: 'style',
          label: 'Color',
          subComponent: 'text',
        }],
      },
      {
        groupLabel: 'Padding',
        settings: [{
          name: 'padding',
          aclName: 'padding_padding',
          type: 'padding-group',
          subComponent: 'container',
          label: 'Element Padding',
        }],
      },
    ],
  };
}

module.exports = textDefault;
