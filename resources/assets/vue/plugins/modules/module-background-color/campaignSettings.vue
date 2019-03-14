<template>
  <SettingsContainer custom-class="generic-color" :label="plugin.title">
    <template slot="setting-right">
      <StuiColorPicker v-model="colors" />
    </template>
  </SettingsContainer>
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
        return this.module.structure.attribute.bgcolor || this.plugin.config.defaultValue;
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
