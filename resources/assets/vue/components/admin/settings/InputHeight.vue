<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6">
        <label class="clearfix control-label" for="height">Height</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="height"
          :class="{'clearfix': true, 'is-danger': errors.has('height') }"
          @change="(val)=>saveStyle(val,'height')"
          :min="1"
        ></el-input-number>
    </div>
  </div>
</template>

<script>

export default {
  name: "input-height",
  props: ["setting"],
  data() {
    return {
      height: ''
    };
  },
  mounted() {
    this.height = this.getValue("height");
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
    }
  },
  methods: {
    getValue(name) {
      return this.component.style[name].replace("px", "");
    },

    saveStyle(val, name) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val + "px"
      });
    }
  }
};
</script>