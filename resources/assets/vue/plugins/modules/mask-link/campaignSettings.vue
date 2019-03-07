<template>
  <settings-container :label="plugin.title">
    <template slot="setting-bottom">
      <stui-input-text
          placeholder="Mask Tag"
          v-model="maskDescription" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: { SettingsContainer },
  props: ["moduleDataIndex", "moduleDataKey"],
  mixins: [pluginCampaignMixin],
  computed: {
    maskDescription: {
      get() {
        if (this.module.type === 'studio') {
          return this.element[this.subComponent].attribute.dataDescription;
        } else if (typeof this.moduleDataIndex != 'undefined' || typeof this.moduleDataKey != 'undefined') {
          return this.module.data && !_.isUndefined(this.module.data[this.moduleDataKey]) && !_.isUndefined(this.module.data[this.moduleDataKey][this.moduleDataIndex])
            ? this.module.data[this.moduleDataKey][this.moduleDataIndex].dataDescription
            : null;
        } else {
          return this.module.data && this.module.data['dataDescription'] ? this.module.data['dataDescription'] : null;
        }
      },
      set(value) {
        this.saveComponentProperty("dataDescription", value);
      },
    },
    subComponent() {
      return this.element.type.split('-')[0];
    }
  },
  created() {
    if (_.has(this.element, 'plugins.destinationUrl.config.validations.url.selected')) {
      this.element.plugins.destinationUrl.config.validations.url.selected = 'url';
    }
  },
  methods: {
    saveComponentProperty(property, value) {
      value = value.replace(/[^a-zA-Z0-9_\[\]]/g, '');
      if (this.module.type === 'studio') {
        this.saveAttributeInThisElement({
          property,
          value
        });
      } else if (typeof this.moduleDataIndex != 'undefined') {
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
    }
  }
};
</script>
