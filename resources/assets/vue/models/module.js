import _ from 'lodash';

function Module(data = {}) {
  this.moduleId = data._id || undefined;
  this.name = data.name || data.title || '';
  this.type = data.type || 'studio';
  this.status = data.status || '';
  const style = (data.structure && data.structure.style) ? data.structure.style : {};
  const settings = (data.structure && data.structure.settings) ? data.structure.settings : [];

  this.structure = {
    style: {
      backgroundColor: style.backgroundColor || '#FFFFFF',
      paddingTop: style.paddingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingBottom: style.paddingBottom || 0,
      paddingRight: style.paddingRight || 0,
      borderWidth: style.borderWidth || '0px',
      borderStyle: style.borderStyle ||'none',
      borderColor: style.borderColor ||'#000000',
    },
    settings: [
      {
        link: 'color',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        value: '#FFFFFF',
      },
      {
        link: 'style',
        label: 'Padding',
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
            value: '#000000',
          },
        ],
      }, 
    ],

    columns: data.structure && data.structure.columns ? data.structure.columns : [],
  };

  _.extend(this.structure.settings, settings);

  return this;
}

module.exports = Module;
