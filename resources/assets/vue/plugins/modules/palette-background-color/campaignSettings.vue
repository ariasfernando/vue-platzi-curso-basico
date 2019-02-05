<template>
  <settings-container :label="plugin.config.options.bgcolor.label" class="plugin-palette">
    <template slot="setting-right">
      <stui-color-picker v-model="color" :palette="palette" />
    </template>
  </settings-container>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  mixins: [pluginCampaignMixin],
  components: {
    SettingsContainer,
  },
  computed: {
    palette() {
      return this.plugin.config.options.bgcolor.palette.map(
        color =>
          color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()
      );
    },
    color: {
      get() {
        return {
          hex: this.element[this.plugin.subComponent].attribute.bgcolor,
        };
      },
      set(value) {
        this.saveAttributeInThisElement({ property: 'bgcolor', value: value.hex });
      },
    },
  },
};
</script>
