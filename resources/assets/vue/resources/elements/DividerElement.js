function dividerDefault() {
  return {
    type: 'divider-element',
    style: {
      backgroundColor: 'transparent',
      height: '5px',
      width: '100%',
      // Border Top
      borderTopWidth: '0px',
      borderTopStyle: 'none',
      borderTopColor: '#000000',
      // Border Right
      borderRightWidth: '0px',
      borderRightStyle: 'none',
      borderRightColor: '#000000',
      // Border Bottom
      borderBottomWidth: '0px',
      borderBottomStyle: 'none',
      borderBottomColor: '#000000',
      // Border Left
      borderLeftWidth: '0px',
      borderLeftStyle: 'none',
      borderLeftColor: '#000000',
    },
    settings: [
      {
        link: 'style',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        value: { hex: 'transparent' },
      },
      {
        link: 'style',
        label: 'Height',
        name: 'height',
        type: 'text',
        value: '5px',
      },
      {
        link: 'style',
        label: 'Width',
        name: 'width',
        type: 'text',
        value: '100%',
      },
      {
        link: 'style',
        label: 'Border Top',
        name: 'border',
        group: [
          {
            link: 'style',
            label: 'border top width',
            name: 'borderTopWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Top Style',
            name: 'borderTopStyle',
            type: 'select',
            value: 'none',
            options: [
              { value: 'solid', text: 'solid' },
              { value: 'inherit', text: 'inherit' },
              { value: 'initial', text: 'initial' },
              { value: 'outset', text: 'outset' },
              { value: 'inset', text: 'inset' },
              { value: 'double', text: 'double' },
              { value: 'dashed', text: 'dashed' },
              { value: 'dotted', text: 'dotted' },
              { value: 'hidden', text: 'hidden' },
              { value: 'none', text: 'none' },
            ],
          },
          {
            link: 'style',
            label: 'Border Top Color',
            name: 'borderTopColor',
            type: 'color',
            value: { hex: '#000000' },
          },
        ],
      },
      {
        link: 'style',
        label: 'Border Right',
        name: 'border',
        group: [
          {
            link: 'style',
            label: 'border Right width',
            name: 'borderRightWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Right Style',
            name: 'borderRightStyle',
            type: 'select',
            value: 'none',
            options: [
              { value: 'solid', text: 'solid' },
              { value: 'inherit', text: 'inherit' },
              { value: 'initial', text: 'initial' },
              { value: 'outset', text: 'outset' },
              { value: 'inset', text: 'inset' },
              { value: 'double', text: 'double' },
              { value: 'dashed', text: 'dashed' },
              { value: 'dotted', text: 'dotted' },
              { value: 'hidden', text: 'hidden' },
              { value: 'none', text: 'none' },
            ],
          },
          {
            link: 'style',
            label: 'Border Right Color',
            name: 'borderRightColor',
            type: 'color',
            value: { hex: '#000000' },
          },
        ],
      },
      {
        link: 'style',
        label: 'Border Bottom',
        name: 'border',
        group: [
          {
            link: 'style',
            label: 'border Bottom width',
            name: 'borderBottomWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Bottom Style',
            name: 'borderBottomStyle',
            type: 'select',
            value: 'none',
            options: [
              { value: 'solid', text: 'solid' },
              { value: 'inherit', text: 'inherit' },
              { value: 'initial', text: 'initial' },
              { value: 'outset', text: 'outset' },
              { value: 'inset', text: 'inset' },
              { value: 'double', text: 'double' },
              { value: 'dashed', text: 'dashed' },
              { value: 'dotted', text: 'dotted' },
              { value: 'hidden', text: 'hidden' },
              { value: 'none', text: 'none' },
            ],
          },
          {
            link: 'style',
            label: 'Border Bottomm Color',
            name: 'borderBottomColor',
            type: 'color',
            value: { hex: '#000000' },
          },
        ],
      },
      {
        link: 'style',
        label: 'Border Left',
        name: 'border',
        group: [
          {
            link: 'style',
            label: 'border Leftt width',
            name: 'borderLeftWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Left Style',
            name: 'borderLeftStyle',
            type: 'select',
            value: 'none',
            options: [
              { value: 'solid', text: 'solid' },
              { value: 'inherit', text: 'inherit' },
              { value: 'initial', text: 'initial' },
              { value: 'outset', text: 'outset' },
              { value: 'inset', text: 'inset' },
              { value: 'double', text: 'double' },
              { value: 'dashed', text: 'dashed' },
              { value: 'dotted', text: 'dotted' },
              { value: 'hidden', text: 'hidden' },
              { value: 'none', text: 'none' },
            ],
          },
          {
            link: 'style',
            label: 'Border Left Color',
            name: 'borderLeftColor',
            type: 'color',
            value: { hex: '#000000' },
          },
        ],
      },
    ],
    attribute: {
      align: 'center',
      bgcolor: { hex: 'transparent' },
      width: '100%',
    },
    plugins: {},
    data: {},
    componentSettings: [],
  };
}

module.exports = dividerDefault;
