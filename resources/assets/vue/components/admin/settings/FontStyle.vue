<template>
  <div>
      <label class=" control-label" :for="setting">Font Size</label>
      <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="value"
        :class="{'input': true, 'is-danger': errors.has('font-size') }"
        :name="'font-size'"
        :ref="'font-size'"
        @change="saveValue"
        :min="7"
        :max="24"
      ></el-input-number>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "FontStyle",
  props: ["setting"],
  data() {
    return {
      value: this.getValue()
    };
  },
  methods: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    getValue() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent().columnId].components[
          this.currentComponent().componentId
        ];
      return component.style.fontSize.replace("px", "");
    },
    saveValue(newNum) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent().columnId,
        componentId: this.currentComponent().componentId,
        property: "fontSize",
        value: newNum + "px"
      });
    }
  }
};
</script>
