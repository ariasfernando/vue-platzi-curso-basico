<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-5 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5 control-label">
          <span>
            <toggle-button :value="plugin.enabled" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>
      <div v-if="plugin.enabled" class="form-group">
        <div class="col-xs-6" v-for="(value, name) in plugin.config.options" :key="name">
          <label class="'clearfix control-label label-center" :for="name">{{name}}</label>
          <div class="btn-group control-label">        
            <el-input-number
              size="mini" 
              :value="value"
              :class="{'clearfix': true, 'is-danger': errors.has(name) }"
              @change="(val)=>changeOption(val, name)"
              :max="maxValue(name)"
              :min="minValue(name)"
              :key="name"
            ></el-input-number>
          </div>
        </div>
      </div>
    </form>

  </div>
</template>

<script>

export default {
  props: ["name"],
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

      // Set current component
      this.$store.commit("module/setCurrentComponent", {
        columnId: payload.columnId,
        componentId: payload.componentId
      });
      // Update component view in the third column
      this.$store.commit("module/setChangeSettingComponent", {
          style: this.module.structure.columns[payload.columnId].components[payload.componentId].style || {},
          attribute: this.module.structure.columns[payload.columnId].components[payload.componentId].attribute || {}
        });
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
<style lang="less" scoped>
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