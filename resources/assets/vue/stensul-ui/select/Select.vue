<template>
  <el-select
    size="mini"
    :value="value===false?'':value"
    :placeholder="placeholder"
    @change="(value)=>change(value)">
    <el-option
      v-for="(item) in list"
      :key="item.value"
      :label="item.label"
      :value="item.value" />
  </el-select>
</template>

<script>
export default {
  name: 'StuiSelect',
  props: {
    value: {
      type: [String, Boolean],
      default: '',
    },
    placeholder: {
      type: [String],
      default: '',
    },
    list: {
      type: [Array, Object],
      default() {
        return [];
      },
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
<style lang='scss' scoped>
.stui-input-text /deep/ {
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner,
  .el-input__inner:focus {
    border-color: rgb(120, 220, 214);
  }
}
</style>
