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
  this.name = data.name || data.title || 'Untitled module';
  this.type = data.type || 'studio';
  this.status = data.status || '';
  const style = (data.structure && data.structure.style) ? data.structure.style : {};
  const settings = (data.structure && data.structure.settings) ? data.structure.settings : [];

  this.plugins = data.plugins || getPlugins();

  this.structure = {
    style: {
      paddingTop: style.paddingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingBottom: style.paddingBottom || 0,
      paddingRight: style.paddingRight || 0,
      borderWidth: style.borderWidth || '0px',
      borderStyle: style.borderStyle || 'none',
      borderColor: style.borderColor || '#000000',
      backgroundColor: style.backgroundColor || '#FFFFFF',
    },
    settings: [
      {
        link: 'style',
        label: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        value: '#FFFFFF',
        sketchPickerValue:{hex: '#FFFFFF'},
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
            label: 'Border Color',
            name: 'borderColor',
            type: 'color',
            value: '#000000',
            sketchPickerValue:{hex: '#000000'},
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
