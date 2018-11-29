<template>
  <el-input
    v-bind="$attrs"
    class="stui-input-text"
    :value="value"
    size="mini"
    @change="(value)=>change(value)" />
</template>

<script>
export default {
  name: 'InputText',
  props: ['value'],
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
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: rgb(120, 220, 214);
  }
}
</style>
