<template>
  <settings-container v-if="component" :label="plugin.config.options.bgcolor.label" class="plugin-palette">
    <template slot="setting-right">
      <compact ref="compact" v-model="color" :palette="palette" />
    </template>
  </settings-container>
</template>

<script>
import { Compact } from 'vue-color';
import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  mixins: [pluginGenericCampaignMixin, pluginElementCampaignMixin],
  components: {
    SettingsContainer,
    Compact,
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
        this.saveStyleInThisElement({ property: 'bgcolor', value: value.hex });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.plugin-palette /deep/ {
  .vc-compact-color-item {
    width: 16px;
    height: 16px;
    margin-right: 6px !important;
  }
  .vc-compact {
    padding-top: 5px;
    padding-left: 6px;
    border: 1px solid #dddddd !important;
  }
}
</style>