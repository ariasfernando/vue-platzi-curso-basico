<template>
  <stui-input-disabled v-if="disabled" :value="value" :false-text="falseText" />
  <el-input-number
    v-else
    v-bind="$attrs"
    class="stui-input-number"
    :class="{'is-muted' : isMuted}"
    :value="Number(value)"
    size="mini"
    :controls="true"
    controls-position="right"
    :disabled="isMuted"
    @blur="$emit('blur')"
    @change="(value)=>change(value)" />
</template>

<script>
import muted from '../mixins/muted';

export default {
  name: 'InputNumber',
  mixins: [muted],
  props: {
    value: {
      type: [Number, String, Object, Boolean],
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

.stui-input-number /deep/ {
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
    &:hover:not(.is-disabled) {
      color: $color-secondary;
    }
    &:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) {
      border-color: $color-grey;
      &:focus {
        border-color: $color-secondary;
      }
    }
  }
}
.stui-input-number.is-muted {
  /deep/ {
    .el-input-number__decrease,
    .el-input-number__increase{
      cursor: auto;
    }
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: auto;
    }
  }
  .el-input-number__decrease {
    border-radius: 0 0 1px 0;
  }
  .el-input-number__increase {
    border-radius: 0 1px 0 0;
  }
}
</style>
