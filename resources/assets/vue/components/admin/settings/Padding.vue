<template>
  <div
    class="half-style-setting-padding align-element"
    :title="`Padding ${side}`">
    <span class="side-title">{{ uppercaseSide }}</span>
    <stui-input-number
      v-model="padding"
      v-validate="'required'"
      :min="min"
      :controls="true" />
  </div>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';

export default {
  name: 'Padding',
  mixins: [SettingMixin],
  props: ['side', 'element'],
  data() {
    return {
      min: 0,
    };
  },
  computed: {
    padding: {
      get() {
        return _.parseInt(this.element.style[`padding${this.side}`]) || 0;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: `padding${this.side}`,
          value: `${value}px`,
        });
      },
    },
    uppercaseSide() {
      return this.side.toUpperCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background: #f8f8f8;
  color: #666666;
  cursor: inherit;
  border: 1px solid #dcdfe6;
  font-size: 11px;
  font-weight: 300;
  line-height: 14px;
  border-radius: 0px 2px 2px 0px;
}
.el-button.is-disabled span {
  padding-left: 2px;
  padding-right: 2px;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
.el-button {
  position: absolute;
  right: 0;
  padding: 6px;
  &:active {
    background-color: #f8f8f8;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
.el-input-number--mini {
  width: 57px;
  margin-right: 0px;
  float: right;
}
.half-style-setting-padding {
  width: calc(30% - 15px);
  margin-right: 3px;
  padding: 5px 0;
  float: left;
  position: relative;

  .side-title {
    color: #bdbfbb;
    font-size: 10px;
    margin-bottom: 2px;
    font-weight: 100;
  }

  .el-input-number /deep/ {
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 17px;
    }
  }
}
</style>
  <style lang="less" >
.field-padding {
  input[type='text'] {
    text-align: center;
  }
  .el-input-number .el-input__inner {
    padding: 0 17px 0 0;
    border-radius: 2px 0px 0px 2px;
  }
}
</style>
