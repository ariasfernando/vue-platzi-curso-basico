
<template>
  <div
    class="stui-color-picker"
    :class="{'is-muted' : isMuted}">
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
  </div>
</template>
<script>
import muted from '../mixins/muted';

export default {
  name: 'ColorPicker',
  mixins: [muted],
  props: {
    value: {
      type: [String, Boolean],
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
    placeholder() {
      return this.falseText !== undefined ? this.falseText : 'transparent';
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
.el-color-picker {
  float: right;
  height: 28px;
}
.el-color-picker /deep/ .el-color-picker__icon{
  &:before{
    text-shadow: 0px 1px #666666;
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
    height: 26px;
    width: 34px;
    border-left: 0;
    border-top-right-radius: 2px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 2px;

    .el-color-picker__color{
      border: none;
    }
  }
  .el-input{
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
}

.el-color-dropdown .el-button--text{
  color: #666666;
}
.el-color-dropdown .el-button--default{
  &:hover,
  &:active,
  &:focus{
    color: #666666;
    border: 1px solid #78dcd6;
  }
}

.stui-color-picker.is-muted {
  /deep/ {
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
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
</style>
