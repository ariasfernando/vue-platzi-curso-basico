<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Background color</label>

    <el-color-picker v-model="backgroundData" @active-change="changeColor" @change="changeColor" color-format="hex"></el-color-picker>
  </div>
</template>
<script>
export default {
  name: "BackgroundColor",
  props: ["setting"],
  data() {
    return {
      backgroundData: this.background
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
      return this.component.attribute['bgcolor'];
    }
  },
  methods: {
    changeColor(color) {
      this.saveAttribute(color);
    },
    saveAttribute(newValue) {
      if(!Application.utils.validateHexVal(newValue)){
        newValue = Application.utils.rgbToHex(newValue)
      }
      this.$store.commit("module/saveComponentAttribute", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: 'bgcolor',
        value: newValue
      });
    }
  },
  watch: {
    background (value) {
      this.backgroundData = value
    }
  },
};
</script>