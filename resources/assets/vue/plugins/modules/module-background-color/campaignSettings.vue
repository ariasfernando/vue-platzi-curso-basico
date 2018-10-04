<template>
  <settings-container custom-class="generic-color" :label="plugin.title">
    <template slot="setting-right">
      <div class="input-text-hex" @click="openColorPicker()">
        <el-input
          v-model="colors"
          size="mini"
          placeholder="transparent"
          disabled="disabled" />
      </div>
      <el-color-picker :ref="`generic-color${instance}`" v-model="colors" color-format="hex" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import pluginModuleCampaignMixin from '../mixins/pluginModuleCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginGenericCampaignMixin, pluginModuleCampaignMixin],
  props: ['name', 'plugin', 'moduleId'],
  data() {
    return {
      instance: Math.floor(100000 + (Math.random() * 900000)),
    };
  },
  computed: {
    colors: {
      get() {
        const value =
          this.module.structure.attribute &&
          this.module.structure.attribute.bgcolor
            ? this.module.structure.attribute.bgcolor
            : this.plugin.config.defaultValue;
        return value;
      },
      set(newValue) {
        let value = newValue;
        if (!Application.utils.validateHexVal(newValue)) {
          value = newValue === null ? '' : Application.utils.rgbToHex(newValue);
        }
        this.saveAttributeModule({ attribute: 'bgcolor', value });
      },
    },
  },
  methods: {
    openColorPicker() {
      this.$refs[`generic-color${this.instance}`].$el.children[0].click();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker /deep/ .el-color-picker__icon {
  &:before {
    text-shadow: 0px 1px #666666;
  }
}
.input-text-hex {
  width: calc(100% - 34px);
  float: left;
}
.generic-color /deep/ .el-input {
  padding: 0;
}
.generic-color /deep/ .el-color-picker__trigger {
  padding: 0px;
  height: 26px;
  width: 34px;
  border-left: 0;
  border-top-right-radius: 2px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 2px;
  .el-color-picker__color {
    border: none;
  }
}
.generic-color /deep/ .el-input {
  .el-input__inner {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
  }
  &.is-disabled .el-input__inner {
    background-color: #fff;
    color: #666666;
    cursor: auto;
    padding: 0;
    font-size: 12px;
    text-align: center;
    height: 26px;
  }
}
</style>
