<template>
  <el-input-number
    v-bind="$attrs"
    class="stui-input-number"
    :value="Number(value)"
    size="mini"
    :controls="true"
    controls-position="right"
    @blur="$emit('blur')"
    @change="(value)=>change(value)" />
</template>

<script>
export default {
  name: 'InputNumber',
  props: ['value'],
  methods: {
    change(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input-number /deep/ {
  width: 100%;
  .el-input-number__decrease,
  .el-input-number__increase {
    width: 17px;
  }
}
</style>
