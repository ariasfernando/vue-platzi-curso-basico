function Module(data = {}) {
  this.moduleId = data._id || undefined;
  this.name = data.name || data.title || '';
  this.type = data.type || 'studio';
  this.status = data.status || '';
  const style = (data.structure && data.structure.style) ? data.structure.style : {};
  this.structure = {
    style: {
      width: style.width || '660',
      backgroundColor: style.backgroundColor || '#FFFFFF',
      paddingTop: style.paddingTop || 0,
      paddingBottom: style.padingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingRight: style.paddingLeft || 0,
    },
    columns: data.structure && data.structure.columns ? data.structure.columns : [],
  };

  return this;
}

module.exports = Module;
