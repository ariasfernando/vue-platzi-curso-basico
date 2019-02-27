<template>
  <div class="control" :class="{'is-expanded': expanded}">
    <ElSelect
      v-model="localValue"
      class="stui-select"
      v-bind="$attrs"
      :class="isNumbered ? 'is-numbered' : ''"
      size="mini"
      :multiple="multiple"
      :placeholder="placeholder">
      <ElOption
        v-for="(item, index) in list"
        :key="item.value || index"
        :label="item.label || item.name || item"
        :disabled="item.disabled || false"
        :value="item.value || item" />
    </ElSelect>
    <div
      v-show="validationNotif.show"
      class="stui-validation-notif"
      :class="{'is-danger': validationNotif.type === 'error'}">
      {{ validationNotif.msg }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StuiSelect',
  inheritAttrs: false,
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
    expanded: Boolean,
    validationNotif: {
      type: Object,
      default() {
        return [];
      },
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
