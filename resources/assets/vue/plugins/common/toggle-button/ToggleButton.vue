<template>
    <el-switch
      v-model="toggled"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :width="width"
      :disabled="disabled">
    </el-switch>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: '#78DCD6'
    },
    inactiveColor: {
      type: String,
      default: '#dcdfe6'
    },
    width: {
      type: Number,
      default: 40
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    toggled: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-switch /deep/ .el-switch__core {
  width: 34px !important;
  height: 18px;

  &:after {
    width: 14px;
    height: 14px;
  }
}
.el-switch.is-checked /deep/ .el-switch__core {
  &:after {
    margin-left: -15px;
  }
}
.el-switch{
  float: right;
}
</style>