<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-12 control-label">Padding</label>
    <div class="clearfix control-label">
      <div
        v-for="padding in paddings"
        :key="padding.name"
        class="col-xs-6 padding-custom align-element"
        :title="padding.label"
        v-b-tooltip.hover
        :data-tooltip="padding.label"
          >
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="padding.value"
          @change="(val)=>changeValue(val, padding.name)"
          :min="min"
          :controls="false"
        ></el-input-number>
        <el-button
        class="button"
          disabled="disabled"
        >px</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "padding",
  props: ["setting", "element"],
  mixins: [SettingMixin],
  data() {
    return {
      min: 0
    };
  },
  mounted() {},
  computed: {
    paddings() {
      return [
        {
          label: "Padding Top",
          name: "paddingTop",
          value: this.getValue("paddingTop")
        },
        {
          label: "Padding Right",
          name: "paddingRight",
          value: this.getValue("paddingRight")
        },
        {
          label: "Padding Bottom",
          name: "paddingBottom",
          value: this.getValue("paddingBottom")
        },
        {
          label: "Padding Left",
          name: "paddingLeft",
          value: this.getValue("paddingLeft")
        }
      ];
    }
  },
  methods: {
    changeValue(val, styleName) {
      val = isNaN(val) || val < this.min ? this.min : val;
      this.$emit("style-setting-updated", {
        name: styleName,
        value: `${val}px`
      });
    },
    getValue(styleName) {
      return _.parseInt(this.element.style[styleName]);
    }
  }
};
</script>
<style lang="less" scoped>
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: #606266;
  cursor: inherit;
  border: 1px solid #dcdfe6;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
button.el-button {
  position: absolute;
  right: 0;
  padding: 6px;
  &:active {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
.padding-custom {
  padding: 5px 0;
}
.el-input-number--mini {
  width: 86px;
  margin-right: 26px;
  float: right;
}
.field-padding {
  padding-right: 15px;
}
</style>
<style lang="less" >
.field-padding {
  input[type="text"] {
    text-align: center;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0;
  }
}
</style>
