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
    templateBackgroundColor: typeof config.templateBackgroundColor === 'undefined' ? '#FFFFFF' : config.templateBackgroundColor,
    contentBackgroundColor: typeof config.contentBackgroundColor === 'undefined' ? '#FFFFFF' : config.contentBackgroundColor,
    templateBackgroundPalettes: config.templateBackgroundPalettes || '',
    colorPalettes: config.colorPalettes || '',
    fontFamily: config.fontFamily || 'Arial',
    fontSize: config.fontSize || '14',
    fontColor: typeof config.fontColor === 'undefined' ? '#000000' : config.fontColor,
    lineHeight: config.lineHeight || '18',
    linkColor: typeof config.linkColor === 'undefined' ? '#000000' : config.linkColor,
    linkDecoration: config.linkDecoration || 'underline',
    externalCssLink: config.externalCssLink || '',
    propietaryCss: config.propietaryCss || '',
    prependHtml: config.prependHtml || '',
    appendHtml: config.appendHtml || '',
    fixedModules: config.fixedModules || '',
    padding: config.padding || '',
    esp: config.esp || false,
    espProvider: config.espProvider || false,
    plainText: config.plainText || false,
    preheader: config.preheader || false,
    tracking: config.tracking || false,
    tagging: config.tagging || false,
    templating: config.templating || false,
    htmlToPdf: config.htmlToPdf || false,
  };

  const groups = [];

  this.modules = data.modules || [];

  return this;
}

module.exports = Library;
