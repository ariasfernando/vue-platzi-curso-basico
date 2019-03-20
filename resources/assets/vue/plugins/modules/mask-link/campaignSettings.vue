<template>
  <SettingsContainer :label="plugin.title">
    <template slot="setting-bottom">
      <StuiInputText
        v-model="maskDescription"
        :placeholder="placeholder" />
    </template>
  </SettingsContainer>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  props: ['moduleDataIndex', 'moduleDataKey'],
  computed: {
    placeholder() {
      return this.plugin.placeholder || 'Mask tag';
    },
    maskDescription: {
      get() {
        if (this.module.type === 'studio') {
          return this.element[this.subComponent].attribute.dataDescription;
        } else if (typeof this.moduleDataIndex !== 'undefined' || typeof this.moduleDataKey !== 'undefined') {
          return this.module.data && !_.isUndefined(this.module.data[this.moduleDataKey]) && !_.isUndefined(this.module.data[this.moduleDataKey][this.moduleDataIndex])
            ? this.module.data[this.moduleDataKey][this.moduleDataIndex].dataDescription
            : null;
        }
        return this.module.data && this.module.data.dataDescription ? this.module.data.dataDescription : null;
      },
      set(value) {
        this.saveComponentProperty('dataDescription', value);
      },
    },
    subComponent() {
      return this.element.type.split('-')[0];
    },
  },
  created() {
    if (_.has(this.element, 'plugins.destinationUrl.config.validations.url.selected')) {
      this.saveElementPluginData({
        elementId: this.element.id,
        plugin: 'destinationUrl',
        type: 'config',
        path: 'validations.url.selected',
        value: 'url',
      });
    }
  },
  methods: {
    saveComponentProperty(property, newValue) {
      const value = newValue.replace(/[^a-zA-Z0-9_[\]]/g, '');
      if (this.module.type === 'studio') {
        this.saveAttributeInThisElement({
          property,
          value,
        });
      } else if (typeof this.moduleDataIndex !== 'undefined') {
        const data = JSON.parse(JSON.stringify(this.module.data));
        data[this.moduleDataKey][this.moduleDataIndex][property] = value;
        this.$store.commit('campaign/saveCustomModuleData', {
          moduleId: this.moduleId,
          data,
        });
      } else {
        const data = {};
        data[property] = value;
        this.$store.commit('campaign/saveCustomModuleData', {
          moduleId: this.moduleId,
          data,
        });
      }
    },
  },
};
</script>
