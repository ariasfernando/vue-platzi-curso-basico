<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Color</label>

    <el-color-picker v-model="colorData" @active-change="changeColor" @change="changeColor" color-format="hex" show-alpha></el-color-picker>
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
      if (!Application.utils.validateHexVal(val) && _.endsWith(val,", 1)")) {
        val = val.replace(", 1)", ")").replace("rgba", "rgb");
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