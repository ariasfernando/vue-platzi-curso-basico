<template>
  <el-checkbox
    :value="value"
    :disabled="disabled"
    class="stui-checkbox"
    @change="change">
    {{ label }}
  </el-checkbox>
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
.stui-checkbox /deep/ {
  .el-checkbox__label {
    text-align: left;
    color: #666666;
    font-weight: 300;
    font-size: 12px;
    line-height: 1.42em;
    margin-bottom: 0;
    padding-left: 5px;
  }
  .el-checkbox__label {
    color: #666666;
  }
  &.is-disabled .el-checkbox__label{
    color: #c0c4cc;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #666666;
    border-color: #666666;
  }
  &.is-disabled .el-checkbox__input.is-checked .el-checkbox__inner,
  &.is-disabled .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #c0c4cc;
    border-color: #c0c4cc;
  }
}
</style>

