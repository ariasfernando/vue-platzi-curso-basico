<template>
  <div>
    <el-button
      v-if="disabled"
      class="stui-input-autodisable is-auto-disabled"
      size="mini"
      disabled>
      {{ value }}
    </el-button>

    <stui-input-number
      v-else-if="isNumeric"
      v-model="numberValue"
      v-bind="$attrs"
      class="stui-input-autodisable"
      :class="{'is-auto-disabled': autoDisable}" />

    <stui-input-text
      v-else
      v-model="textValue"
      v-bind="$attrs"
      class="stui-input-autodisable"
      :class="{'is-auto-disabled': autoDisable}" />
  </div>
</template>


<script>
export default {
  name: 'InputAutoDisable',
  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: false,
    },
    isNumeric: {
      type: Boolean,
      default: false,
    },
    disableOn: {
      type: [String, Number, Object, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    autoDisable() {
      return this.isNumeric
        ? this.numberValue === this.disableOn
        : this.textValue === this.disableOn;
    },
    numberValue: {
      get() {
        return this.value === false ? this.disableOn : this.value;
      },
      set(val) {
        const value = this.disableOn !== undefined && val === this.disableOn ? false : val;
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
    textValue: {
      get() {
        if (typeof this.value === 'object') {
          return JSON.stringify(this.value);
        }
        const value = Application.utils.isJsonString(this.value)
          ? JSON.stringify(this.value)
          : String(this.value);

        return value === 'false' ? this.disableOn : value;
      },
      set(val) {
        const value =
          this.disableOn !== undefined && val === this.disableOn ? false : val;
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input-number /deep/ {
  width: 100%;
  .el-input-number__decrease,
  .el-input-number__increase {
    width: 17px;
  }
}

.el-button.is-auto-disabled {
  width: 100%;
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  text-overflow: ellipsis;
  overflow: hidden;
}

.is-auto-disabled /deep/ {
  .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
}
.stui-input-text.is-auto-disabled:after,
.stui-input-number.is-auto-disabled /deep/ .el-input:after {
  /*
    this option disables the click on the input,
    we use this instead of the disabled attribute,
    since we want to be able to click on the up and down arrows
  */
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
