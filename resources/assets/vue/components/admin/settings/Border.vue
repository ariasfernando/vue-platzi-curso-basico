<template>
  <div class="form-group" :class="'field-border'">
    <label>{{`Border ${side}`}}</label>
    <div class="clearfixalign-element">
      <el-color-picker
        v-model="color"
        color-format="hex"
        class="float-left margin-right"
      ></el-color-picker>
      <el-select
      :placeholder="`Border ${this.side} style`"
      v-model="style"
      size="mini"
      class="float-left margin-right"
      >
        <el-option
          v-for="item in optionsBorderStyle"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
      <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="width"
        :min="min"
        :controls="false"
        class="float-left"
      ></el-input-number>
      <el-button
      class="button float-left"
        disabled="disabled"
      >px</el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "border",
  props: ["side", "element"],
  data() {
    return {
      min: 0,
      optionsBorderStyle: [
        { value: "none", label: "none" },
        { value: "solid", label: "solid" },
        { value: "inherit", label: "inherit" },
        { value: "initial", label: "initial" },
        { value: "outset", label: "outset" },
        { value: "inset", label: "inset" },
        { value: "double", label: "double" },
        { value: "dashed", label: "dashed" },
        { value: "dotted", label: "dotted" },
        { value: "hidden", label: "hidden" }
      ]
    };
  },
  mounted() {},
  computed: {
    width: {
      get() {
        return _.parseInt(this.element.style[`border${this.side}Width`]);
      },
      set(width) {
        width = isNaN(width) || width < this.min ? this.min : width;
        if (width > 0) {
          if (this.style == "none") {
            this.style = "solid";
          }
          if (this.color == "") {
            this.color = "#000000";
          }
        } else {
          if (this.style !== "none") {
            this.style = "none";
          }
          if (this.color !== "") {
            this.color = "";
          }
        }
        this.$emit("style-setting-updated", {
          name: `border${this.side}Width`,
          value: `${width}px`
        });
      }
    },
    style: {
      get() {
        return this.element.style[`border${this.side}Style`];
      },
      set(style) {
        this.$emit("style-setting-updated", {
          name: `border${this.side}Style`,
          value: style
        });
      }
    },
    color: {
      get() {
        return this.element.style[`border${this.side}Color`] === "transparent"
          ? ""
          : this.element.style[`border${this.side}Color`];
      },
      set(color) {
        if (!Application.utils.validateHexVal(color)) {
          color =
            color === null ? "transparent" : Application.utils.rgbToHex(color);
        }
        this.$emit("style-setting-updated", {
          name: `border${this.side}Color`,
          value: color
        });
      }
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
  border-left: 0;
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
  padding: 6px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.el-color-picker {
  height: 30px;
}
.float-left {
  float: left;
}
.el-select {
  width: 100px;
}
.margin-right {
  margin-right: 5px;
}
.el-input-number {
  width: 67px;
}
#edit-container .right-bar .form-group,
#edit-container .left-bar .form-group {
  margin-bottom: 0;
  &:last-of-type {
    margin-bottom: 6px;
  }
}
</style>
<style lang="less" >
.field-border {
  input[type="text"] {
    text-align: center;
  }
  .el-input-number.is-without-controls .el-input__inner {
    padding: 0;
  }
  .el-color-picker__trigger {
    padding: 3px;
    height: 28px;
    width: 34px;
  }
  input.el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
