<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <el-input-number
        v-model="height"
        :max="options.max"
        :min="options.min"
        size="mini"
        :class="{'input': true}" />
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

<style lang="scss" scoped>
.el-input {
  padding: 6px 0 0;
}
.el-input-number /deep/ {
  width: 100%;
  .el-input-number__decrease {
    border-radius: 2px 0px 0px 2px;
    background: #f8f8f8;
  }
  .el-input-number__increase {
    border-radius: 0px 2px 2px 0px;
    background: #f8f8f8;
  }
  .el-input__inner {
    font-weight: 300;

    &:active,
    &:focus {
      border: 1px solid #78dcd6;
    }
  }
}
</style>
