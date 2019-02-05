
<template>
  <div
    class="control"
    :class="rootClasses">
    <compact-picker
      v-if="palette"
      ref="compact"
      :value="paletteValue"
      :palette="palette"
      :disabled="disabled || isMuted"
      @input="(value)=>change(value)" />
    <template v-else>
      <div class="input-text-hex" @click="openColorPicker()">
        <el-input
          :placeholder="placeholder"
          disabled="disabled"
          :value="inputValue"
          size="mini" />
      </div>
      <el-color-picker
        :ref="`color-picker-${instance}`"
        :value="pickerValue"
        color-format="hex"
        :disabled="disabled || isMuted"
        @change="(value)=>change(value)" />
    </template>
  </div>
</template>
<script>
import { Compact } from 'vue-color';
import muted from '../mixins/muted';

export default {
  name: 'ColorPicker',
  components: {
    'compact-picker': Compact,
  },
  mixins: [muted],
  props: {
    value: {
      type: [String, Object, Boolean],
      default: '',
    },
    falseText: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    palette: {
      type: Array,
      default: undefined,
    },
    expanded: Boolean,
  },
  data() {
    return {
      instance: Math.floor((100000 + Math.random()) * 900000),
    };
  },
  computed: {
    inputValue() {
      if (this.falseText !== undefined) {
        return this.value === false ? this.falseText : this.value;
      }
      return this.value;
    },
    pickerValue() {
      // el-color-picker Expects a String, so we convert false to null
      return this.value === false ? null : this.value;
    },
    paletteValue() {
      return this.value;
    },
    placeholder() {
      return this.falseText !== undefined ? this.falseText : 'transparent';
    },
    rootClasses() {
      return {
        'is-muted': this.isMuted,
        'stui-color-picker': !this.palette,
        'stui-color-palette': this.palette,
        'is-expanded': this.expanded,
      };
    },
  },
  methods: {
    openColorPicker() {
      this.$refs[`color-picker-${this.instance}`].$el.children[0].click();
    },
    change(val) {
      const value = val === null ? false : val;
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/stui.scss';

.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker /deep/ .el-color-picker__icon{
  &:before{
    text-shadow: 0px 1px $stui-label-color;
  }
}
.input-text-hex {
  width: calc(100% - 34px);
  float: left;
}
.stui-color-picker /deep/ {
  .el-input {
    padding: 0;
  }
  .el-color-picker__trigger {
    padding: 0px;
    height: 28px;
    width: 34px;
    border-left: 0;
    border-top-right-radius: 2px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 2px;
    border-color: $stui-input-border-color;
    .el-color-picker__color{
      border: none;
    }
    .el-color-picker__color-inner {
      border-radius: 1px;
    }
  }
  .el-input{
    .el-input__inner {
      border-color: $stui-input-border-color;
      border-top-left-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 2px;
    }
    &.is-disabled .el-input__inner {
      background-color: #fff;
      color: $stui-label-color;
      cursor: auto;
      padding: 0;
      font-size: 12px;
      text-align: center;
      height: 28px;
    }
  }
}

.el-color-dropdown .el-button--text{
  color: #666666;
}
.el-color-dropdown .el-button--default{
  &:hover,
  &:active,
  &:focus{
    color: #666666;
    border: 1px solid $stui-color-secondary;
  }
}

.stui-color-picker.is-muted {
  /deep/ {
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: $stui-disabled-background;
      border-color: $stui-disabled-border-color;
      color: $stui-disabled-color;
      cursor: auto;
    }
    .el-color-picker__mask {
      cursor: auto;
      bottom: 3px;
      right: 1px;
      height: auto;
      width: auto;
    }
    .el-color-picker.is-disabled .el-color-picker__trigger {
      cursor: auto;
    }
  }
}

.stui-color-palette /deep/ .vc-compact-color-item {
  width: 16px;
  height: 16px;
  margin-right: 6px !important;
}
.stui-color-palette /deep/ .vc-compact {
  padding-top: 5px;
  padding-left: 6px;
  border: 1px solid $stui-input-border-color !important;
}
</style>
