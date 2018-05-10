import Vue from 'vue';

function Tag(data) {
  this.name = data.name;
  return this;
}

module.exports = Tag;

export default function (data) {
  this.name = data.name || undefined;

  return this;
};