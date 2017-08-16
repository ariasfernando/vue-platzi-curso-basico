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
      width: style.width || '660',
      backgroundColor: style.backgroundColor || '#FFFFFF',
      paddingTop: style.paddingTop || 0,
      paddingBottom: style.padingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingRight: style.paddingLeft || 0,
    },
    settings: [
      {
        link: 'style',
        label: 'Width',
        name: 'width',
        type: 'text',
        value: '660',
      },
      {
        link: 'style',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'text',
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
            label: 'Padding Left',
            name: 'paddingLeft',
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
            label: 'Padding Right',
            name: 'paddingRight',
            type: 'text',
            value: '0px',
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
