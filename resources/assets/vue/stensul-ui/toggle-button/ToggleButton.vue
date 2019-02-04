<template>
  <div class="control">
    <el-switch
      v-model="toggled"
      class="stui-toggle-button"
      v-bind="$attrs"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :width="width"
      :disabled="disabled" />
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: '#78DCD6',
    },
    inactiveColor: {
      type: String,
      default: '#dcdfe6',
    },
    width: {
      type: Number,
      default: 40,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    toggled: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.stui-toggle-button {
  float: right;
  padding-top: 6px;

  /deep/ .el-switch__core {
    width: 34px !important;
    height: 18px;

    &:after {
      width: 14px;
      height: 14px;
    }
  }
  &.is-checked /deep/ .el-switch__core {
    &:after {
      margin-left: -15px;
    }
  }
}
</style>
