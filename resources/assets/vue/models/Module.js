import Vue from 'vue';

function getPlugins() {
  const plugins = {};
  _.each(Vue.prototype.$_app.modulePlugins, (plugin, name) => {
    if (plugin.target.indexOf('module') !== -1) {
      plugins[name] = _.cloneDeep(plugin);
    }
  });
  return plugins;
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
    columns: data.structure && data.structure.columns ? data.structure.columns : [],
  };
  return this;
}

module.exports = Module;
