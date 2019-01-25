<template>
  <stui-input-disabled v-if="disabled" :value="value" />
  <el-input
    v-else
    v-bind="$attrs"
    class="stui-input-text"
    :class="{'is-muted' : isMuted}"
    :value="_value"
    size="mini"
    :disabled="isMuted"
    @blur="$emit('blur')"
    @change="(value)=>change(value)" />
</template>

<script>
import muted from '../mixins/muted';

export default {
  name: 'InputText',
  mixins: [muted],
  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: false,
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
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: $color-secondary;
  }
}
.stui-input-text.is-muted {
  /deep/ {
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: auto;
    }
  }
}
</style>
