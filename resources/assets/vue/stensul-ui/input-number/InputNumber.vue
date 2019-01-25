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
  padding-top: 0;
  padding-bottom: 0;
  .el-input__inner {
    border-radius: 2px;
    padding-left: 0;
    padding-right: 15px;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    width: 17px;
  }
  .el-input-number__decrease {
    border-radius: 0 0 1px 0;
  }
  .el-input-number__increase {
    border-radius: 0 1px 0 0;
  }
}
</style>
