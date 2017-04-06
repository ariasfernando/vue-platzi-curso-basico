import _ from 'underscore'

function Library(data = {}) {

  this.id = data._id || undefined;
  this.name = data.name || "Unnamed Library";
  this.description = data.description || "";
  this.createdAt = data.created_at || "";
  this.updatedAt = data.updated_at || "";

  let config = data.config || {};

  this.config = {
    templateWidth: config.templateWidth || "",
    templateMobileWidth: config.templateMobileWidth || "",
    templateBackgroundColor: config.templateBackgroundColor || "",
    fontFamily: config.fontFamily || "",
    fontSize: config.fontSize || "",
    fontColor: config.fontColor || "",
    lineHeight: config.lineHeight || ""
  };

  let groups = [];

  _.each(data.modules, function (modules, group) {
    groups.push({
      name: group,
      modules: modules
    });
  });

  this.modules = groups;

  return this;
}

module.exports = Library;