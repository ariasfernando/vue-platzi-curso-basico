<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-input-number
        v-model="height"
        :max="options.max"
        :min="options.min" />
    </template>
  </settings-container>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  data() {
    return {
      subComponent: 'divider',
      options: this.plugin.config.options,
    };
  },
  computed: {
    height: {
      get() {
        return _.parseInt(this.element.divider.style.height);
      },
      set(value) {
        this.saveStyleInThisElement({
          property: 'height',
          value: `${value}px`,
        });
      },
    },
  },
};
</script>
