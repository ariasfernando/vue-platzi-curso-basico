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
  this.title = data.title || data.name;
  this.type = data.type || 'studio';
  this.status = data.status || '';
  this.data = data.data || {};
  const style = (data.structure && data.structure.style) ? data.structure.style : {};
  const settings = (data.structure && data.structure.settings) ? data.structure.settings : [];
  const attribute = (data.structure && data.structure.attribute) ? data.structure.attribute : {};

  this.plugins = data.plugins || getPlugins();

  this.structure = {
    columnsFixed: false,
    attribute: {
      bgcolor: attribute.bgcolor || { hex: 'transparent' },
    },
    style: {
      // Padding
      paddingTop: style.paddingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingBottom: style.paddingBottom || 0,
      paddingRight: style.paddingRight || 0,
      // Border Top
      borderTopWidth: style.borderTopWidth || '0px',
      borderTopStyle: style.borderTopStyle || 'none',
      borderTopColor: style.borderTopColor || '#000000',
      // Border Right
      borderRightWidth: style.borderRightWidth || '0px',
      borderRightStyle: style.borderRightStyle || 'none',
      borderRightColor: style.borderRightColor || '#000000',
      // Border Bottom
      borderBottomWidth: style.borderBottomWidth || '0px',
      borderBottomStyle: style.borderBottomStyle || 'none',
      borderBottomColor: style.borderBottomColor || '#000000',
      // Border Left
      borderLeftWidth: style.borderLeftWidth || '0px',
      borderLeftStyle: style.borderLeftStyle || 'none',
      borderLeftColor: style.borderLeftColor || '#000000',
    },
    settings: [
      {
        link: 'attribute',
        label: 'Background Color',
        name: 'bgcolor',
        type: 'color',
        transparentChecked: true,
        value: 'transparent',
        sketchPickerValue: { hex: '#FFFFFF' },
      },
      {
        link: 'style',
        label: 'Padding',
        name:'padding',
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
            transparentChecked: false,
            value: '#000000',
            sketchPickerValue: { hex: '#000000' },
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
            transparentChecked: false,
            value: '#000000',
            sketchPickerValue: { hex: '#000000' },
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
            transparentChecked: false,
            value: '#000000',
            sketchPickerValue: { hex: '#000000' },
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
            transparentChecked: false,
            value: '#000000',
            sketchPickerValue: { hex: '#000000' },
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
