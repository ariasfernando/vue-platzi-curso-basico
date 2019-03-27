<template>
  <SettingsContainer :label="plugin.config.options.bgcolor.label" class="plugin-palette">
    <template slot="setting-right">
      <stui-color-picker v-model="color" :palette="palette" />
    </template>
  </SettingsContainer>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: {
    SettingsContainer,
  },
  mixins: [pluginCampaignMixin],
  computed: {
    palette() {
      return this.plugin.config.options.bgcolor.palette.map(
        color =>
          (color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase()),
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
