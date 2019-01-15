<template>
  <div>
    <el-button
      v-if="disabled"
      class="stui-input-autodisable is-auto-disabled"
      size="mini"
      disabled>
      {{ value }}
    </el-button>

    <component
      :is="autodisableComponent"
      v-model="inputValue"
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
    autodisableComponent: {
      type: String,
      default: 'stui-input-text',
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
      let value = false;
      if (this.autodisableComponent === 'stui-input-number') {
        value = this.numberValue === this.disableOn;
      }
      value = this.textValue === this.disableOn;
      return value;
    },
    inputValue: {
      get() {
        if (this.autodisableComponent === 'stui-input-number') {
          return this.numberValue;
        }
        return this.textValue;
      },
      set(val) {
        if (this.autodisableComponent === 'stui-input-number') {
          this.numberValue(val);
        }
        this.textValue(val);
      },
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
  methods: {
    isSubType(type) {
      return this.subType === type;
    },
  },
};
</script>

<style lang="scss" scoped>
.stui-input-autodisable {
  &.is-auto-disabled.el-button {
    width: 100%;
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &.is-auto-disabled /deep/ {
    .el-input__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
    }
  }
  &.is-auto-disabled {
    position: relative;
    &:before{
      /* this option disables the click on the input */
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
    }
  }
  &.is-auto-disabled:after {
    /* clearfix for floated components */
    content:'';
    clear:both;
    display: table;
  }
}
</style>
