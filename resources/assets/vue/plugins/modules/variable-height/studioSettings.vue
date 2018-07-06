<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="plugin.enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <settings-container  v-if="plugin.enabled" label-left="MIN" label-right="MAX">
      <template slot="setting-half-left">
        <el-input-number
          size="mini" 
          :value="plugin.config.options.min"
          @change="(val)=>changeOption(val, 'min')"
          :max="maxValue('min')"
          :min="minValue('min')"
        ></el-input-number>
      </template>
      <template slot="setting-half-right">   
        <el-input-number
          size="mini" 
          :value="plugin.config.options.max"
          @change="(val)=>changeOption(val, 'max')"
          :max="maxValue('max')"
          :min="minValue('max')"
        ></el-input-number>
      </template>
    </settings-container>
  </div>
</template>

<script>

import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
export default {
  props: ["name"],
  components: { SettingsContainer },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    module() {
      return this.$store.getters["module/module"];
    },
    plugin() {
      const module = this.module,
        columnId = this.currentComponent.columnId,
        componentId = this.currentComponent.componentId;

      const plugin =
        module.structure.columns[columnId].components[componentId].plugins[
          this.name
        ];
      this.enabled = plugin.enabled;
      this.options = plugin.config.options;

      return plugin;
    }
  },
  data() {
    return {
      enabled: false,
      options: {}
    };
  },
  methods: {
    maxValue(name) {
      return name === "min" ? this.options.max -1 : undefined;
    },
    minValue(name) {
      return name === "max" ? this.options.min + 1: undefined;
    },
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value
      };
      // Update state of the component
      this.$store.commit("module/togglePlugin", payload);

    },
    changeOption(valueHeight, nameHeight) {
      let maxHeight = this.plugin.config.options.max;
      let minHeight = this.plugin.config.options.min;
      let options = {};

      if (nameHeight === "max") {
        maxHeight = valueHeight;
      }

      if (nameHeight === "min") {
        minHeight = valueHeight;
      }

      options = {
        max: maxHeight,
        min: minHeight
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config: {
          options
        }
      };

      // Save plugin data
      this.$store.commit("module/savePlugin", payload);
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group {
  text-align: left;
  padding: 5px 5px 10px;
}
.label-center {
  display: block;
  text-align: center !important;
  padding-bottom: 0px !important;
  padding-top: 0 !important;
  text-transform: uppercase;
}
</style>