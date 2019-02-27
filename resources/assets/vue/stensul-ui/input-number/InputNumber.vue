<template>
  <StuiInputDisabled v-if="disabled" :value="value" :false-text="falseText" />
  <div v-else class="control" :class="{'is-expanded': expanded}">
    <ElInputNumber
      v-bind="$attrs"
      class="stui-input stui-input-number"
      :class="{
        'is-muted' : isMuted,
        'is-danger': validationNotif.type === 'error' & validationNotif.show
      }"
      :value="Number(value)"
      size="mini"
      :controls="true"
      controls-position="right"
      :disabled="isMuted || inputDisabled"
      @blur="$emit('blur')"
      @change="(value)=>change(value)" />
    <div
      v-show="validationNotif.show"
      class="stui-validation-notif"
      :class="{'is-danger': validationNotif.type === 'error'}">
      {{ validationNotif.msg }}
    </div>
  </div>
</template>

<script>
import muted from '../mixins/muted';

export default {
  name: 'InputNumber',
  mixins: [muted],
  inheritAttrs: false,
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
    expanded: Boolean,
    inputDisabled: Boolean,
    validationNotif: {
      type: Object,
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
    border-color: $stui-input-border-color;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    width: 17px;
    background-color: $stui-input-control-background;
    &:hover:not(.is-disabled) {
      color: $stui-color-secondary;
    }
    &:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) {
      border-color: $stui-color-grey;
      &:focus {
        border-color: $stui-color-secondary;
      }
    }
  }
}
.stui-input-number {
  &.is-muted {
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
  &.is-danger /deep/ .el-input__inner {
    border-color: $stui-color-danger;
  }
}
</style>
