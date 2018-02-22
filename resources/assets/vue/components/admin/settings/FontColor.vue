<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Color</label>

    <el-color-picker v-model="colorData" @active-change="changeColor" @change="changeColor" color-format="hex"></el-color-picker>
    <el-input
      size="mini"
      v-model="colorData"
      placeholder="transparent"
      @change="changeColor"
      class="col-sm-4" 
      disabled="disabled"
    >
    </el-input>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "FontColor",
  props: ["setting"],
  data() {
    return {
      colorData: this.color
    };
  },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent.columnId].components[
          this.currentComponent.componentId
        ];
      return component;
    },
    currentValue() {
      return this.component.attribute["color"];
    }
  },
  methods: {
    changeColor(color) {
      this.saveStyle(color);
    },
    saveStyle(val) {
      if (!Application.utils.validateHexVal(val)) {
        val = Application.utils.rgbToHex(val);
      }
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: "color",
        value: val
      });
    }
  },
  watch: {
    color(value) {
      this.colorData = value;
    }
  }
};
</script>
<style lang="less">
.field-font-color {
  .el-input--mini {
    width: 31.3%;
    padding: 7px 0 0 0;
  }
  .el-color-picker__trigger {
    padding: 3px;
    height: 28px;
    width: 34px;
    border-right: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 4px;
  }
  .el-color-picker {
    padding: 7px 0 0 0;
    float: left;
  }
  input.el-input__inner {
    text-align: center;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    color: #666666;
    cursor: auto;
    padding: 0;
  }
}
</style>
