<template>
  <div class="control" :class="{'is-expanded': expanded}">
    <el-input
      class="stui-input-disabled"
      size="mini"
      disabled
      :placeholder="_value" />
  </div>
</template>
<script>
export default {
  name: 'InputDisabled',
  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: false,
    },
    falseText: {
      type: String,
      default: undefined,
    },
    expanded: Boolean,
  },
  computed: {
    _value() {
      if (this.falseText) {
        return this.falseText;
      }
      return typeof this.value === 'object' || typeof this.value === 'boolean' ? JSON.stringify(this.value) : this.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.stui-input-disabled.is-disabled {
  width: 100%;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  /deep/ .el-input__inner {
    text-overflow: ellipsis;
    text-align: center;
    border-radius: 2px;
  }
}
</style>
