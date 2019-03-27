<template>
  <StuiInputDisabled v-if="disabled" :value="value" />
  <StuiField
    v-else
    vertical
    :class="{'is-expanded': expanded}">
    <div class="control">
      <ElInput
        :value="_value"
        v-bind="$attrs"
        class="stui-input-text"
        :class="{
          'is-muted' : isMuted,
          'is-danger': validationNotif.type === 'error' & validationNotif.show
        }"
        size="mini"
        :disabled="isMuted || inputDisabled"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange" />
    </div>
    <StuiNotif v-if="validationNotif.show" :value="validationNotif" />
  </StuiField>
</template>

<script>
import muted from '../mixins/muted';

export default {
  name: 'InputText',
  mixins: [muted],
  inheritAttrs: false,
  data() {
    return {
      timeOut: null,
    };
  },
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
    inputDisabled: Boolean,
    validationNotif: {
      type: Object,
      default() {
        return {};
      },
    },
    debounce: {
      type: Number,
      default: 0,
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
    handleBlur(value) {
      this.$emit('blur', value);
    },
    handleInput(value) {
      if (this.debounce > 0) {
        if (this.timeOut) {
          window.clearTimeout(this.timeOut);
        }
        this.timeOut = window.setTimeout(() => this.$emit('input', value), this.debounce);
      } else {
        this.$emit('input', value);
      }
    },
    handleChange(value) {
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
.stui-input-text {
  &.is-muted {
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
  &.is-danger {
    /deep/ {
      .el-input__inner,
      .el-textarea__inner {
        border-color: $stui-color-danger;
      }
    }
  }
}
</style>
