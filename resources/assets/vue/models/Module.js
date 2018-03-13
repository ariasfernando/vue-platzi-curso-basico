import _ from 'lodash';
import clone from 'clone';
import Vue from 'vue/dist/vue';

function getPlugins() {
  const plugins = {};
  _.each(Vue.prototype.$_app.modulePlugins, (plugin, name) => {
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
  const mobileClasses = data.mobileClasses || [];

  this.plugins = data.plugins || getPlugins();

  this.structure = {
    columnsFixed: (data.structure && data.structure.columnsFixed) ? data.structure.columnsFixed : false,
    invertedStacking: (data.structure && data.structure.invertedStacking) ? data.structure.invertedStacking : false,
    attribute: {
      bgcolor: attribute.bgcolor || 'transparent',
      classes: '',
    },
    mobileClasses,
    style: {
      // Padding
      paddingTop: style.paddingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingBottom: style.paddingBottom || 0,
      paddingRight: style.paddingRight || 0,
      // Border Top
      borderTopWidth: style.borderTopWidth || '0px',
      borderTopStyle: style.borderTopStyle || 'none',
      borderTopColor: style.borderTopColor || 'transparent',
      // Border Right
      borderRightWidth: style.borderRightWidth || '0px',
      borderRightStyle: style.borderRightStyle || 'none',
      borderRightColor: style.borderRightColor || 'transparent',
      // Border Bottom
      borderBottomWidth: style.borderBottomWidth || '0px',
      borderBottomStyle: style.borderBottomStyle || 'none',
      borderBottomColor: style.borderBottomColor || 'transparent',
      // Border Left
      borderLeftWidth: style.borderLeftWidth || '0px',
      borderLeftStyle: style.borderLeftStyle || 'none',
      borderLeftColor: style.borderLeftColor || 'transparent',
    },
    componentSettings: [
      [
        {
          name: 'bgcolor',
          type: 'generic-color',
          link: 'attribute',
          label: 'Background Color',
        },
      ],
      [
        {
          name: 'padding',
          type: 'padding',
        },
        {
          name: 'border-group',
          type: 'border-group',
        },
      ],
    ],
    settings: [],

    columns: data.structure && data.structure.columns ? data.structure.columns : [],
  };

  _.extend(this.structure.settings, settings);
  _.extend(this.structure.attribute, attribute);

  return this;
}

module.exports = Module;
