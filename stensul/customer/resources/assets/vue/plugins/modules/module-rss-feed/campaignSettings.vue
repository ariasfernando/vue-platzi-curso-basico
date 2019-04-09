<template>
  <SettingsContainer custom-class="generic-color" :label="plugin.title">
    <template slot="setting-right">
      <StuiButton type="primary" @click="() => showModal = !showModal">Import values</StuiButton>
      <Modal
        v-if="showModal"
        title="Import values from RSS Feed"
        :source="source"
        :filter="filter"
        :adapter="EntryAdapter"
        :filters-layout="layout"
        button-submit-text="Import values"
        @select="importEntry"
        @close-modal="showModal = false" />
    </template>
  </SettingsContainer>
 </template>

<script>
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';
import Modal from './modal.vue';
import EntryAdapter from './entry-adapter.vue';

const scopeLevels = [
  'subComponent',
  'link',
  'property',
];

export default {
  components: {
    SettingsContainer,
    Modal,
  },
  extends: pluginCampaignMixin,
  props: ['name', 'plugin', 'moduleId'],
  data() {
    return {
      filter: (entry, filters) => {
        if (filters.search) {
          const regex = new RegExp(filters.search, 'i');
          const matchs = _.get(this.plugin, 'config.filters.searchPaths', []).filter(key => regex.test(entry[key]));
          if (!matchs.length) return false;
        }
        const pubDate = new Date(entry.pubDate);
        if (filters.from && pubDate < filters.from) return false;
        if (filters.to && pubDate > filters.to) return false;
        return true;
      },
      layout: [
        {
          settings: [
            {
              name: 'search',
              path: 'filters',
              type: 'stui-input-text',
              label: 'Search',
              placeholder: '(Search)',
            },
            {
              name: 'from',
              path: 'filters',
              type: 'el-date-picker',
              label: 'From',
              changeEvent: 'input',
              placeholder: '(Date)',
            },
            {
              name: 'to',
              path: 'filters',
              type: 'el-date-picker',
              label: 'To',
              changeEvent: 'input',
              placeholder: '(Date)',
            },
          ],
        },
      ],
      EntryAdapter,
      showModal: false,
    };
  },
  computed: {
    elements() {
      return _.get(this.module, 'structure.rows', []).reduce((retRows, row) => {
        retRows.push(row);
        return _.get(row, 'columns', []).reduce((retColumns, column) => {
          retColumns.push(column);
          return _.get(column, 'components', []).reduce((retComponents, component) => {
            retComponents.push(component);
            return retComponents;
          }, retColumns);
        }, retRows);
      }, []);
    },
    source() {
      return _.get(this.plugin, 'config.source');
    },
  },
  methods: {
    importEntry(entry) {
      const commits = _.get(this.plugin, 'config.commits', []);
      commits.forEach((commit) => {
        const element = _.find(this.elements, commit.match);
        const template = _.template(_.get(commit, 'mask', '${value}'));
        if (!element) return;
        const commitPath = commit.commitPath.split('.');
        const payload = commitPath.reduce((ret, key, index) => {
          ret[scopeLevels[index]] = key;
          return ret;
        }, {
          moduleIdInstance: this.moduleIdInstance,
          elementId: element.id,
          value: template({
            value: _.get(entry, commit.entryPath),
          }),
          property: commitPath.pop(),
        });
        this.saveElementProperty(payload);
        if (payload.property === 'text') {
          this.saveElementProperty(Object.assign({}, payload, {
            property: 'textDirty',
            value: Math.floor(100000 + (Math.random() * 900000)),
          }));
        }
      });
      this.showModal = false;
    },
  },
};
</script>
