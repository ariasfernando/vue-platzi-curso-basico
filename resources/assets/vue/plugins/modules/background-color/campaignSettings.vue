<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-color-picker v-model="colors" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  computed: {
    colors: {
      get() {
        return this.element[this.plugin.subComponent].attribute.bgcolor;
      },
      set(newValue) {
        let value = newValue;
        if (!Application.utils.validateHexVal(newValue)) {
          value = newValue === null ? '' : Application.utils.rgbToHex(newValue);
        }
        this.saveAttributeInThisElement({ property: 'bgcolor', value });
      },
    },
  },
};
</script>
