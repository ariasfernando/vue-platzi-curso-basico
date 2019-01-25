<template>
  <settings-container :label="label" custom-class="width-setting">
    <template slot="setting-right">
      <stui-input-number
        v-model="mainSettingNumeric"
        v-validate="'required'"
        :min="minValueCalculated"
        :max="maxValueCalculated"
        class="padding-custom"
        :controls="false" />
      <el-button
        slot="append"
        class="button icon-disable"
        @click="onTogglePxWidth">
        {{ this.isPxWidth ? "px": "%" }}
      </el-button>
    </template>
  </settings-container>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'width',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  watch: {
    element: {
      handler() {
        this.defineStyleOption();
      },
      deep: true,
    },
  },
  mounted() {
    this.defineStyleOption();
  },
  computed: {
    isPxWidth: {
      get() {
        return this.element.styleOption.isPxWidth;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isPxWidth',
          value,
        });
      },
    },
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(value) {
        let newValue =
          isNaN(value) || value < this.minValueCalculated
            ? this.minValueCalculated
            : value;
        newValue = this.isPxWidth ? `${newValue}` : `${newValue}%`;
        this.mainSetting = newValue;
      },
    },
    minValueCalculated() {
      return this.minValue ? this.minValue : 1;
    },
    maxValueCalculated() {
      return this.isPxWidth ? undefined : 100;
    },
  },
  methods: {
    onTogglePxWidth() {
      const isPxWidth = !this.isPxWidth;
      let width = this.mainSettingNumeric;
      if (!isPxWidth) {
        width = Math.min(100, parseFloat(this.mainSettingNumeric));
      }
      width =
        isNaN(width) || width < this.minValueCalculated
          ? this.minValueCalculated
          : width;
      width = isPxWidth ? `${width}` : `${width}%`;
      this.isPxWidth = isPxWidth;
      this.mainSetting = width;
    },
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.element.styleOption.isPxWidth === undefined) {
        this.isPxWidth = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.width-setting /deep/ {
  .button input {
    text-align: center;
  }
  .el-button {
    background: #f8f8f8;
    color: #666666;
    cursor: inherit;
    border: 1px solid #dcdfe6;
    font-size: 11px;
    font-weight: 300;
    line-height: 14px;
    border-radius: 0px 2px 2px 0px;
    height: 28px !important;
    &:hover {
      color: #78dcd6;
    }
  }
  .input-number-size {
    padding-left: 0;
    padding-right: 21px;
  }
  .el-button.is-active .el-input__inner,
  .el-input__inner:focus {
    border: 1px solid #dcdfe6;
  }
  button.el-button {
    padding: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    float: right;
    width: 26px;
  }
  .el-input-number {
    width: 94px;
    .el-input__inner,
    .el-input-number__increase,
    .el-input-number__decrease {
      border-radius: 0;
      border-right: 0;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      right: 0px;
    }
  }
}
</style>
