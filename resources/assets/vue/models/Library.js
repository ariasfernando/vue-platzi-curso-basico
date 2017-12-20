import _ from 'lodash';

function Library(data = {}) {

  this.id = data._id || undefined;
  this.name = data.name || 'Unnamed Library';
  this.description = data.description || '';
  this.createdAt = data.created_at || '';
  this.updatedAt = data.updated_at || '';

  const config = data.config || {};

  this.config = {
    templateWidth: config.templateWidth || '660',
    templateMobileWidth: config.templateMobileWidth || '480',
    templateBackgroundColor: config.templateBackgroundColor || '#FFFFFF',
    contentBackgroundColor: config.contentBackgroundColor || '#FFFFFF',
    fontFamily: config.fontFamily || 'Arial',
    fontSize: config.fontSize || '14',
    fontColor: config.fontColor || '#000000',
    lineHeight: config.lineHeight || '18',
    linkColor: config.linkColor || '#000000',
    linkDecoration: config.linkDecoration || 'underline',
    externalCssLink: config.externalCssLink || '',
    propietaryCss: config.propietaryCss || '',
    padding: config.padding || '',
    esp: config.esp || false,
    espProvider: config.espProvider || false,
    plainText: config.plainText || false,
    preheader: config.preheader || false,
    tagging: config.tagging || false,
    templating: config.templating || false,
  };

  const groups = [];

  _.each(data.modules, (modules, group) => {
    groups.push({
      name: group,
      modules,
    });
  });

  this.modules = groups;

  return this;
}

module.exports = Library;