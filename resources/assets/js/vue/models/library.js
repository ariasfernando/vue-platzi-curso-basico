import _ from 'underscore'

function Library(data = {}) {

  this.id = data._id || undefined;
  this.name = data.name || "Unnamed Library";
  this.description = data.description || "";
  this.createdAt = data.created_at || "";
  this.updatedAt = data.updated_at || "";

  let config = data.config || {};

  this.config = {
    templateWidth: config.templateWidth || "660",
    templateMobileWidth: config.templateMobileWidth || "480",
    templateBackgroundColor: config.templateBackgroundColor || "#FFFFFF",
    contentBackgroundColor: config.templateBackgroundColor || "#FFFFFF",
    fontFamily: config.fontFamily || "Arial",
    fontSize: config.fontSize || "14",
    fontColor: config.fontColor || "#000000",
    lineHeight: config.lineHeight || "18",
    linkColor: config.linkColor || "#000000",
    linkDecoration: config.linkDecoration || "underline",
    externalCssLink: config.externalCssLink || "",
    propietaryCss: config.propietaryCss || ""
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