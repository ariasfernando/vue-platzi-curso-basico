import Vue from 'vue';
import Element from './Element';

function getPlugins() {
  const plugins = {};
  _.each(Vue.prototype.$_app.modulePlugins, (plugin, name) => {
    if (plugin.target.indexOf('module') !== -1) {
      plugins[name] = _.cloneDeep(plugin);
    }
  });
  return plugins;
}
function getNewColumn() {
  const plugins = {};
  const modulePlugins = Vue.prototype.$_app.modulePlugins;

  _.each(modulePlugins, (plugin, name) => {
    switch (plugin.target.indexOf('column') !== -1) {
      case true:
        plugins[name] = _.cloneDeep(plugin);
        break;
      default:
    }
  });
  return new Element({ type: 'column-element', plugins }).getProperties();
}
function getNewRow() {
  const plugins = {};
  const modulePlugins = Vue.prototype.$_app.modulePlugins;

  _.each(modulePlugins, (plugin, name) => {
    switch (plugin.target.indexOf('row') !== -1) {
      case true:
        plugins[name] = _.cloneDeep(plugin);
        break;
      default:
    }
  });
  const row = new Element({ type: 'row-element', plugins }).getProperties();
  row.columns[0] = getNewColumn();
  return row;
}
function Module(data = {}) {
  this.libraries = data.libraries || [];
  this.moduleId = data._id;
  this.name = data.name || data.title || 'Untitled module';
  this.description = data.description || '';
  this.created_by = data.created_by ? data.created_by.email : '';
  this.updated_by = data.updated_by ? data.updated_by.email : '';
  this.created_at = data.created_at || '';
  this.updated_at = data.updated_at || '';
  this.title = data.title || data.name;
  this.type = data.type || 'studio';
  this.status = data.status || '';
  this.data = data.data || {};
  this.inUse = data.in_use || 0;

  this.plugins = _.merge(getPlugins(), data.plugins);

  this.structure = {
    columnsStacking: data.structure ? data.structure.columnsStacking : 'normal',
    attribute: data.structure ? data.structure.attribute : {},
    mobileClasses: data.mobileClasses || [],
    style: data.structure ? data.structure.style : {},
    rows: data.structure && data.structure.rows ? data.structure.rows : [ getNewRow() ],
  };
  return this;
}

module.exports = Module;
