import _ from 'lodash';
import clone from 'clone';

function getPlugins() {
  const plugins = {};
  _.each(Application.globals.modulePlugins, (plugin, name) => {
    if (plugin.target.indexOf('module') !== -1) {
      plugins[name] = clone(plugin);
    }
  });
  return plugins;
}

function Module(data = {}) {
  this.moduleId = data._id || undefined;
  this.name = data.name || data.title || '';
  this.type = data.type || 'studio';
  this.status = data.status || '';
  const style = (data.structure && data.structure.style) ? data.structure.style : {};
  const settings = (data.structure && data.structure.settings) ? data.structure.settings : [];
  const attribute = (data.structure && data.structure.attribute) ? data.structure.attribute : [];

  this.plugins = data.plugins || getPlugins();

  this.structure = {
    attribute: {
      bgcolor: '#FFFFFF',
    },
    style: {
      paddingTop: style.paddingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingBottom: style.paddingBottom || 0,
      paddingRight: style.paddingRight || 0,
      borderWidth: style.borderWidth || '0px',
      borderStyle: style.borderStyle || 'none',
      borderColor: style.borderColor || '#000000',
    },
    settings: [
      {
        link: 'attribute',
        label: 'Background Color',
        name: 'bgcolor',
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
  _.extend(this.structure.attribute, attribute);

  return this;
}

module.exports = Module;
