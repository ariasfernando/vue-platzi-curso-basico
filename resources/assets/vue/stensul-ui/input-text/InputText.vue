<template>
  <stui-input-disabled v-if="disabled" :value="value" />
  <div v-else class="control" :class="{'is-expanded': expanded}">
    <el-input
      v-bind="$attrs"
      class="stui-input-text"
      :class="{'is-muted' : isMuted}"
      :value="_value"
      size="mini"
      :disabled="isMuted"
      @blur="$emit('blur')"
      @change="(value)=>change(value)" />
  </div>
</template>

<script>
import muted from '../mixins/muted';

export default {
  name: 'InputText',
  mixins: [muted],
  props: {
    value: {
      type: [String, Number, Object, Boolean],
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
    expanded: Boolean,
  },
  computed: {
    _value() {
      if (this.falseText !== undefined && this.value === false) {
        return this.falseText;
      }
      return typeof this.value === 'object' ? JSON.stringify(this.value) : this.value;
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
@import '../scss/stui.scss';
.stui-input-text /deep/ {
  .el-input__inner,
  .el-textarea__inner {
    border-color: $stui-input-border-color;
    border-radius: 2px;
    padding-left: 8px;
    padding-right: 8px;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus,
  .el-textarea.is-active .el-textarea__inner{
    border-color: $stui-color-secondary;
  }
}
.stui-input-text.is-muted {
  /deep/ {
    .el-input__inner,
    .el-textarea__inner,
    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: auto;
    }
  }
}
</style>
