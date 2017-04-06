import _ from 'underscore'

function Module(data = {}) {

  this.id = data.id || "";
  this.name = data.name || "Image With Text";

  let style = data.style || {};

  this.structure = {
    style: {
      width: style.width || "660",
      backgroundColor: style.backgroundColor || "#FFFFFF",
      paddingTop: style.paddingTop || 0,
      paddingBottom: style.padingTop || 0,
      paddingLeft: style.paddingLeft || 0,
      paddingRight: style.paddingLeft || 0
    },
    columns: data.structure && data.structure.columns ? data.structure.columns : []
  };

  return this;
}

module.exports = Module;