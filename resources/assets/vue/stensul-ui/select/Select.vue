<template>
  <el-select
    v-model="localValue"
    class="stui-select"
    v-bind="$attrs"
    :class="isNumbered ? 'is-numbered' : ''"
    size="mini"
    :multiple="multiple"
    :placeholder="placeholder">
    <el-option
      v-for="(item, index) in list"
      :key="item.value || index"
      :label="item.label || item"
      :value="item.value || item" />
  </el-select>
</template>

<script>
export default {
  name: 'StuiSelect',
  props: {
    value: {
      type: [String, Array, Boolean],
      default: '',
    },
    placeholder: {
      type: [String],
      default: 'Select',
    },
    list: {
      type: [Array, Object],
      default() {
        return [];
      },
    },
    isNumbered: {
      type: [Boolean],
      default: false,
    },
    getSplit: {
      type: [String],
      default: '',
    },
    setJoin: {
      type: [String],
      default: '',
    },
    multiple: {
      type: [Boolean],
      default: false,
    },
  },
  computed: {
    localValue: {
      get() {
        const value = this.value;
        if (this.getSplit) {
          return value.split(this.getSplit);
        }
        return value;
      },
      set(newValue) {
        let value = newValue;
        if (this.setJoin) {
          value = newValue.join(this.setJoin);
        }
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../scss/stui.scss';
.stui-select {
  width: 100%;
  /deep/ {
    .el-input__inner {
      border-radius: 2px;
      border-color: $stui-input-border-color;
    }
    .el-input__inner:focus,
    .el-input.is-focus .el-input__inner,
    .el-input__inner:focus {
      border-color: $stui-color-secondary;
    }
    .el-input .el-select__caret {
      color: $stui-label-color;
    }
    .el-input .el-input__suffix {
      right: 0px;
      color: $stui-input-border-color;
    }
  }
}
.el-select-dropdown__item.selected{
  color: $stui-color-secondary !important;
}
.is-numbered /deep/ span > span.el-tag.el-tag--info {
  counter-increment: step-counter;
  & span::before {
    content: counter(step-counter);
    margin-right: 5px;
  }
}
</style>
