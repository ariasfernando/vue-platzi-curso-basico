<template>
  <settings-container class="field-font-family" label="Font Family">
    <template slot="setting-bottom">
      <el-select
        v-model="fontFamily"
        class="width-full"
        size="mini">
        <el-option
          v-for="item in plugin.config"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginGenericCampaignMixin, pluginElementCampaignMixin],
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
