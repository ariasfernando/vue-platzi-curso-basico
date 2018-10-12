<template>
  <settings-container :label="label">
    <template :slot="settingSlot || 'setting-right'">
      <el-input-number
        v-model="mainSettingNumeric"
        v-validate="'required'"
        :controls="!(isPercentage || isPixel)"
        :class="isPercentage || isPixel ? 'width-unit' : 'width-full'"
        size="mini"
        :min="minValue"
        :max="maxCaluculate" />
      <el-button
        v-if="isPercentage || isPixel"
        slot="append"
        :style="isPercentage && isPixel ? 'cursor: pointer' : 'cursor: default'"
        :class="`button ${isPercentage && isPixel ? '': 'icon-disable'}`"
        :disabled="!(isPercentage && isPixel)"
        @click="onToggleUnit">
        {{ isNumberPercentage ? "%": "px" }}
      </el-button>
    </template>
  </settings-container>
</template>
<script>
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import SettingMixin from '../mixins/SettingMixin';

export default {
  name: 'GenericNumber',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(newValue) {
        if (typeof this.mainSetting === 'string' && this.mainSetting.endsWith('%')) {
          this.mainSetting = `${Math.min(this.maxPercentage || 100, newValue)}%`;
        } else {
          const parceSetting = parseFloat(newValue);
          this.mainSetting = this.link === 'attribute' ? parceSetting : `${parceSetting}px`;
        }
      },
    },
    isNumberPercentage() {
      return (
        typeof this.mainSetting === 'string' && this.mainSetting.endsWith('%')
      );
    },
    maxCaluculate() {
      return this.isNumberPercentage ? this.maxPercentage || 100 : this.maxValue;
    },
  },
  methods: {
    onToggleUnit() {
      if (this.isPercentage && this.isPixel) {
        const parceSetting = parseFloat(this.mainSetting);
        if (this.isNumberPercentage) {
          this.mainSetting = this.link === 'attribute' ? parceSetting : `${parceSetting}px`;
        } else {
          this.mainSetting = `${Math.min(100, parceSetting)}%`;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background: #f8f8f8;
  color: #666666;
  cursor: inherit;
  border: 1px solid #dcdfe6;
}
.el-button.is-disabled span {
  padding-left: 2px;
  padding-right: 2px;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-input-number /deep/ .el-input__inner {
  padding: 0;
  border-radius: 2px 0px 0px 2px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
.el-button {
  position: absolute;
  right: 0;
  padding: 6px;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
  border-radius: 0px 2px 2px 0px;
  width: 30px;
  &:active {
    background-color: #f8f8f8;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
.el-input-number--mini.width-unit {
  width: 80px;
  margin-right: 25px;
  float: right;
}
.half-style-setting-padding {
  width: calc(50% - 15px);
  margin-right: 15px;
  padding: 5px 0;
  float: left;
  position: relative;
}
.half-style-setting-padding:nth-of-type(2n + 2) {
  margin-left: 15px;
  margin-right: 0;
  padding-left: 0;
}
.width-full {
  width: 100%;
}
.is-setting-half .el-input-number--mini.width-unit {
  float: left;
  margin-right: 0;
}
.is-setting-half .el-button {
  bottom: 0;
  right: 12px;
}
</style>
