<template>
  <div
    class="half-style-setting-padding align-element"
    :title="`Padding ${this.side}`"
    v-b-tooltip.hover
    :data-tooltip="`Padding ${this.side}`"
      >
    <el-input-number
      size="mini" 
      v-validate="'required'"
      v-model="padding"
      :min="min"
      :controls="false"
    ></el-input-number>
    <el-button
      class="button"
      disabled="disabled"
    >px</el-button>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "Padding",
  props: ["side", "element"],
  mixins: [SettingMixin],
  data() {
    return {
      min: 0
    };
  },
  computed: {
    padding: {
      get() {
        return _.parseInt(this.element.style[`padding${this.side}`]) || 0;
      },
      set(value) {
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link: "style",
          name: `padding${this.side}`,
          value: `${value}px`
        });
      }
    }
  },
};
</script>
<style lang="less" scoped>
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
.el-button.is-disabled span{
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
  width: 80px;
  margin-right: 25px;
  float: right;
}
.half-style-setting-padding {
  width: calc(~"50% - 15px");
  margin-right: 15px;
  padding: 5px 0;
  float: left;
  position: relative;
}
.half-style-setting-padding:nth-of-type(2n + 2) {
  margin-left: 15px;
  margin-right: 0;
  padding-left: 0;
}
</style>
  <style lang="less" >
.field-padding {
  input[type="text"] {
    text-align: center;
  }
  .el-input-number .el-input__inner {
    padding: 0;
    border-radius: 2px 0px 0px 2px;
  }
}
</style>
