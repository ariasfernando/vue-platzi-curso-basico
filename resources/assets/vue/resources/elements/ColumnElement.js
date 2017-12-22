function columnDefault() {
  return {
    type: 'column-element',
    style: {
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingBottom: '0px',
    paddingRight: '0px',
    backgroundColor: 'transparent',
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
    attribute: {
      width: '100%',
      valign: 'middle',
      bgcolor: 'transparent',
    },
    settings: [
      {
        link: 'attribute',
        label: 'Width',
        name: 'width',
        type: 'text',
        value: '100%',
      },
      {
        link: 'style',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        transparentChecked: true,
        value: { hex: 'transparent' },
      },
      {
        link: 'style',
        label: 'Padding',
        name: 'padding',
        group: [
          {
            link: 'style',
            label: 'Padding Top',
            name: 'paddingTop',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Right',
            name: 'paddingRight',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Bottom',
            name: 'paddingBottom',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Padding Left',
            name: 'paddingLeft',
            type: 'text',
            value: '0px',
          },
        ],
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
            value: 'solid',
          },
          {
            link: 'style',
            label: 'Border Top Color',
            name: 'borderTopColor',
            type: 'color',
            transparentChecked: false,
            value: {hex: '#000000'},
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
            value: 'solid',
          },
          {
            link: 'style',
            label: 'Border Right Color',
            name: 'borderRightColor',
            type: 'color',
            transparentChecked: false,
            value: {hex: '#000000'},
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
            value: 'solid',
          },
          {
            link: 'style',
            label: 'Border Bottomm Color',
            name: 'borderBottomColor',
            type: 'color',
            transparentChecked: false,
            value: {hex: '#000000'},
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
            label: 'border Left width',
            name: 'borderLeftWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Left Style',
            name: 'borderLeftStyle',
            type: 'select',
            value: 'solid',
          },
          {
            link: 'style',
            label: 'Border Left Color',
            name: 'borderLeftColor',
            type: 'color',
            transparentChecked: false,
            value: {hex: '#000000'},
          },
        ],
      },
    ],
    components: [],
    plugins: {},
  };
}

module.exports = columnDefault;