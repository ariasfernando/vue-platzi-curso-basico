<template>
  <div>
    <ElButton
      v-if="!value"
      class="custom-col"
      size="mini"
      disabled>
      {{ falseText }}
    </ElButton>

    <ElInput
      v-else
      v-model="textValue"
      :controls="false"
      class="custom-col toggleable-text"
      size="mini" />
    <ElButton
      size="mini"
      class="el-icon-setting"
      @click="toggle()" />
  </div>
</template>

<script>

export default {
  name: 'InputToggleableText',

  props: {
    value: {
      type: [String, Number, Object, Boolean],
      default: false,
    },
    falseText: {
      type: String,
      default: 'Disabled',
    },
    defaultValue: {
      type: String,
      default: '',
    },
  },
  computed: {
    textValue: {
      get() {
        if (typeof this.value === 'object') {
          return JSON.stringify(this.value);
        } else {
          return Application.utils.isJsonString(this.value)
            ? JSON.stringify(this.value)
            : String(this.value);
        }
      },
      set(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
  },
  methods: {
    toggle() {
      this.textValue = this.value ? false : this.defaultValue;
    },
  },
};
</script>
<style lang='scss' scoped>
  .custom-col {
    width: calc(100% - 28px);
    float: left;
    display: block;
    border-right: 0;
  }

  .el-button {
    transition: unset;
    border-radius: 2px;
    &.active {
      background-color: #78dcd6;
      padding: 7px 4px;
      font-weight: 300;
      color: #ffffff;
      border: 1px solid #78dcd6;
      border-radius: 0px 2px 2px 0px;
      height: 28px!important;
    }
    &--mini,
    &--mini.is-round {
      padding: 7px;
    }
    & + .el-button {
      margin-left: 0;
    }
    &:not(.custom-col) {
      width: 28px;
      padding: 4px 0;
      height: 26px;
      display: block;
      float: left;
    }
    &.is-disabled,
    &.is-disabled:focus,
    &.is-disabled:hover {
      color: #666666;
      background-color: #f0f0f0;
      cursor: auto;
    }
  }

  .el-icon-setting{
    background: #f8f8f8;
    color: #666666;
    border: 1px solid #dcdfe6;
    font-size: 11px;
    font-weight: 300;
    line-height: 14px;
    border-radius: 0px 2px 2px 0px;
    height: 28px!important;

    &:hover{
      color: #78dcd6;
    }
  }

  .toggleable-text /deep/ {
    input.el-input__inner[type="text"] {
      padding-left: 0;
      padding-right: 0;
    }
    .el-input__inner{
      text-align: center;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      &:focus{
        border: 1px solid #78dcd6;
      }
    }
  }
</style>

