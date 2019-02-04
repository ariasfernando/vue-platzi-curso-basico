<template>
  <div class="control">
    <el-checkbox
      :value="value"
      :disabled="disabled"
      class="stui-checkbox"
      @change="change">
      {{ label }}
    </el-checkbox>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/stui.scss';
.stui-checkbox {
  margin-bottom: 0px;
  /deep/ {
    .el-checkbox__label {
      text-align: left;
      color: $stui-label-color;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      margin-bottom: 0;
      padding: 6px 0 7px 5px;
    }
    &.is-disabled .el-checkbox__label{
      color: $stui-disabled-color;
    }
    .el-checkbox__input {
      margin-bottom: -2px;
      &.is-checked .el-checkbox__inner,
      &.is-indeterminate .el-checkbox__inner {
        background-color: $stui-label-color;
        border-color: $stui-label-color;
      }
    }
    &.is-disabled .el-checkbox__input.is-checked .el-checkbox__inner,
    &.is-disabled .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: $stui-disabled-color;
      border-color: $stui-disabled-color;
    }
    .el-checkbox__inner:hover,
    .el-checkbox__input:not(.is-checked).is-focus .el-checkbox__inner {
      border-color: $stui-color-secondary;
    }
  }
}
</style>

