<template>
  <el-select
    v-model="localValue"
    :class="isNumbered ? 'is-numbered' : ''"
    size="mini"
    :multiple="multiple"
    :placeholder="placeholder">
    <el-option
      v-for="(item) in list"
      :key="item.value"
      :label="item.label"
      :value="item.value" />
  </el-select>
</template>

<script>
export default {
  name: 'StuiSelect',
  props: {
    value: {
      type: [String, Boolean],
      default: '',
    },
    placeholder: {
      type: [String],
      default: '',
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
      }
    }
  },
};
</script>
<style lang='scss' scoped>
.stui-input-text /deep/ {
  .el-select .el-input__inner:focus,
  .el-select .el-input.is-focus .el-input__inner,
  .el-input__inner:focus {
    border-color: rgb(120, 220, 214);
  }
}
.el-select-dropdown__item.selected{
  color: #78dcd6!important;
}
.is-numbered /deep/ span > span.el-tag.el-tag--info {
  counter-increment: step-counter;
  & span::before {
    content: counter(step-counter);
    margin-right: 5px;
  }
}
.el-select {
    width: 100%;
}
</style>
