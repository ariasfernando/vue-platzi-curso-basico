module.exports = {
  type: 'button-element',
  defaultText: 'CTA Button',
  text: 'Lorem ipsum',
  enabled: true,
  style: {
    verticalAlign: 'middle',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    color: '#FFFFFF',
    fontSize: '12px',
    lineHeight: '16px',
    paddingTop: '0px',
    paddingBottom: '0px',
    paddingRight: '0px',
    paddingLeft: '0px',
    display: 'block',
    fontWeight: 'normal',
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
    width: '150',
    height: '40',
    align: 'center',
    bgcolor: { hex: '#514960' },
    href: 'http://stensul.com',
    target: '_blank',
  },
  settings: [
    {
      link: 'attribute',
      label: 'Width',
      name: 'width',
      type: 'text',
      value: '150',
    },
    {
      link: 'attribute',
      label: 'Height',
      name: 'height',
      type: 'text',
      value: '40',
    },
    {
      link: 'attribute',
      label: 'Align',
      name: 'align',
      type: 'select',
      value: 'center',
      options:[
        { value: 'center', text: 'center' },
        { value: 'right', text: 'Right' },
        { value: 'left', text: 'Left' },
      ],
    },
    {
      link: 'attribute',
      label: 'Vertical Align',
      name: 'valign',
      type: 'select',
      value: 'middle',
      options: [
        { value: 'top', text: 'Top' },
        { value: 'middle', text: 'Middle' },
        { value: 'bottom', text: 'Bottom' },
      ],
    },
    {
      link: 'attribute',
      label: 'Background Color',
      name: 'bgcolor',
      type: 'color',
      value: { hex: '#514960' },
    },
    {
      link: 'attribute',
      label: 'Default URL',
      name: 'href',
      type: 'text',
      value: 'http://stensul.com',
    },
    {
      link: 'attribute',
      label: 'Target',
      name: 'target',
      type: 'select',
      value: '_blank',
      options:[
        { value: '_blank', text: '_blank' },
        { value: '_self', text: '_self' },
        { value: '_top', text: '_top' },
      ],
    },
    {
      link: 'style',
      label: 'Color',
      name: 'color',
      type: 'color',
      value: { hex: '#FFFFFF' },
    },
    {
      link: 'style',
      label: 'Font Size',
      name: 'fontSize',
      type: 'text',
      value: '12px',
    },
    {
      link: 'style',
      label: 'Line Height',
      name: 'lineHeight',
      type: 'text',
      value: '12px',
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
  userData: ['paddingRight, width'],
};
