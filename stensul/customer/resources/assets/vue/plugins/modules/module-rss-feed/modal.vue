<template>
  <ModalContainer
    :title="title"
    :button-submit-text="buttonSubmitText"
    @submit-modal="ev => $emit('select', selected)"
    @close-modal="ev => $emit('close-modal', ev)">
    <div class="layout">
      <div v-if="filtersLayout" class="filters">
        <SettingsGroupContainer
          :settings="settings"
          :settings-layout="filtersLayout"
          @set-value="setValue" />
      </div>
      <div class="feed">
        <template v-if="!working">
          <div
            v-for="(entry, index) in filtered"
            :key="`index-${index}`"
            :class="{
              'entry-container': true,
              selected: selected === entry
            }"
            @click="ev => selected = entry">
            <Compoment :is="adapter" :entry="entry" />
          </div>
        </template>
      </div>
    </div>
  </ModalContainer>
</template>

<script>

import ModalContainer from 'stensul/components/common/containers/ModalContainer.vue';
import SettingsGroupContainer from 'stensul/components/common/containers/SettingsGroupContainer.vue';

export default {
  components: {
    SettingsGroupContainer,
    ModalContainer,
  },
  props: [
    'title',
    'filter',
    'source',
    'adapter',
    'filtersLayout',
    'buttonSubmitText',
  ],
  data() {
    return {
      settings: {
        filters: {},
      },
      selected: undefined,
      filtered: [],
      entries: [],
      working: false,
    };
  },
  watch: {
    'settings.filters': {
      handler(filters) {
        this.filtered = this.entries.filter(entry => this.filter(entry, filters));
      },
      deep: true,
      immediate: true,
    },
    source: {
      handler({ url, feedPath }) {
        this.working = true;
        this.fetch(url)
          .then(text => (new DOMParser()).parseFromString(text, 'text/xml'))
          .then(xmlDoc => this.xmlToObject(xmlDoc))
          .then(obj => _.get(obj, feedPath, []))
          .then((entries) => {
            this.entries = entries;
            this.settings = _.cloneDeep(this.settings);
            this.working = false;
          });
      },
      immediate: true,
    },
  },
  methods: {
    setValue({ value, path, name }) {
      _.set(this.settings, `${path}.${name}`, value);
      this.settings = _.cloneDeep(this.settings);
    },
    fetch(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/proxy/fetch?url=${encodeURIComponent(url)}`);
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = () => {
          reject('Couldn\'t load resource');
        };
        xhr.send();
      });
    },
    xmlToObject(xml) {
      let obj = {};
      if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let j = 0; j < xml.attributes.length; j++) {
            const attribute = xml.attributes.item(j);
            obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType === 3) {
        obj = xml.nodeValue;
      }
      if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3 && !obj['@attributes']) {
        obj = xml.childNodes[0].nodeValue;
      } else if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes.item(i);
          const nodeName = item.nodeName;
          if (typeof (obj[nodeName]) === 'undefined') {
            obj[nodeName] = this.xmlToObject(item);
          } else {
            if (typeof (obj[nodeName].push) === 'undefined') {
              const old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.xmlToObject(item));
          }
        }
      }
      return obj;
    },
  },
};

</script>

<style lang="less" scoped>
  .layout {
    display: flex;
    height: calc(100vh - 230px);

    .filters {
      width: 234px;
      overflow: auto;
      flex-shrink: 0;
    }

    .feed {
      display: flex;
      flex-direction: column;
      overflow: auto;
      margin: 0 6px;
    }
  }

  .entry-container {
    border: 2px solid #eee;
    border-radius: 3px;
    margin: 6px 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    &.selected {
      border-color: black;
    }
  }
</style>
