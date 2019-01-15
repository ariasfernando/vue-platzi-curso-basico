import _ from 'lodash';

function Setting(data = {}) {
  this.id = data._id || undefined;
  this.name = data.name || '';
  this.key = data.key || '';
  this.value = data.value || '';
  this.properties = data.properties || '';
  this.createdAt = data.created_at || '';
  this.updatedAt = data.updated_at || '';

  return this;
}

module.exports = Setting;
