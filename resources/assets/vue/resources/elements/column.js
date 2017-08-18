module.exports = {
  style: {
    verticalAlign: 'middle',
    textAlign: 'center',
    paddingTop: '0px',
    paddingLeft: '0px',
    paddingBottom: '0px',
    paddingRight: '0px',
    borderWidth:'0px',
    borderColor:'#000000',
    borderStyle:'solid',
    backgroundColor:'#FFFFFF'
  },
  attribute: {
    width: '100%',
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
        value: {hex: '#FFFFFF'},
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
        label: 'Border',
        name: 'border',
        group: [
          {
            link: 'style',
            label: 'border-width',
            name: 'borderWidth',
            type: 'text',
            value: '0px',
          },
          {
            link: 'style',
            label: 'Border Style',
            name: 'borderStyle',
            type: 'select',
            value: 'solid',
          },
          {
            link: 'style',
            label: 'Border Color',
            name: 'borderColor',
            type: 'color',
            value: {hex: '#000000'},
          },
        ],
      }, 
    ],
  components: [],
};
