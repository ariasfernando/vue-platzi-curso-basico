<template>
  <settings-container class="field-font-family" label="Font Family">
    <template slot="setting-right">
      <stui-select
        v-model="fontFamily"
        class="width-full"
        size="mini"
        :list="plugin.config" />
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
    fontFamily: {
      get() {
        return this.element[this.plugin.subComponent].style.fontFamily;
      },
      set(value) {
        this.saveStyleInThisElement({ property: 'fontFamily', value });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.width-full {
  width: 100%;
}
</style>
