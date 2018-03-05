<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="half"><b>{{ plugin.title }}</b></label>
        <div class="half-style-setting padding-top">
          <span>
            <toggle-button :value="plugin.enabled" color="#78DCD6" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group" v-for="(option, name) in plugin.config" :key="name">
        <label class="half" :data-name="name"><b>{{ option.label }}</b></label>
        <div class="half-style-setting padding-top">
          <span>
            <toggle-button v-if="option.type === 'switch'" :disabled="!enabled" :value="option.value" @change="(newValue)=>updateField(newValue, name)"></toggle-button>
            <el-input-number
              v-if="option.type === 'number'" 
              size="mini" 
              v-validate="'required'"
              :value="option.value" 
              @change="(newValue)=>updateField(newValue, name)"
              :min="0"
            ></el-input-number>
            <input v-if="option.type === 'text'" :disabled="!enabled" :type="option.type" :value="option.value" :name="name"  @change="updateFieldByEvent">
            <select v-if="option.type === 'select' || option.type === 'multi-select'" :name="name" v-model="option.value" :value="option.value" :multiple="option.type === 'multi-select'">
              <option v-for="(opt, key) in option.options" :value="opt._id ? opt._id : opt"  :key="key">{{ opt.name ? opt.name : opt }}</option>
            </select>
          </span>
        </div>
        <div v-if="option.value && option.config">
          <br>
          <div v-for="(subopt, subname) in option.config" class="config-inner" :key="subname">
            <label class="half" :data-name="subname"><b>{{ subopt.label }}</b></label>
            <div class="half-style-setting padding-top">
              <span>
                <toggle-button v-if="subopt.type === 'switch'" :value="subopt.value" active-color="#78DCD6" @change="(newValue)=>updateSubField(newValue, name, subname)"></toggle-button>
                <input v-if="subopt.type === 'text'" type="text" :value="subopt.value" :parent="name" :name="subname" @change="updateSubFieldByEvent">
                  <el-input-number
                    v-if="subopt.type === 'number'" 
                    size="mini" 
                    v-validate="'required'"
                    :value="subopt.value" 
                    @change="(newValue)=>updateSubField(newValue, name, subname)"
                    :min="subname === 'padding' ? 0 : 10"
                  ></el-input-number>
                <select v-model="subopt.value" multiple v-if="subopt.type === 'multi-select'" :value="subopt.value" :parent="name" :name="subname">
                  <option v-for="opt in subopt.options" :key="opt">{{ opt }}</option>
                </select>
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import clone from "clone";

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

      return plugin;
    }
  },
  data() {
    return {
      enabled: false
    };
  },
  methods: {
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
        style:
          this.module.structure.columns[payload.columnId].components[
            payload.componentId
          ].style || {},
        attribute:
          this.module.structure.columns[payload.columnId].components[
            payload.componentId
          ].attribute || {}
      });
    },
    updateFieldByEvent(e) {
      let option = "";
      let value = "";

      if (e.target) {
        option = e.target.name;
        value = e.target.value;
      } else {
        const parentElement = e.srcEvent.target.parentElement;
        option = parentElement.attributes.getNamedItem("name").value;
        value = e.value;
      }
      this.updateField(value, option);
    },
    updateField(value, option) {
      const config = {};
      config[option] = {
        value
      };

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config
      };

      this.$store.commit("module/savePlugin", payload);
    },
    updateSubFieldByEvent(e) {
      let option = "";
      let subOption = "";
      let value = "";

      if (e.target) {
        option = e.target.attributes.getNamedItem("parent").value;
        subOption = e.target.name;
        value = e.target.value;
      } else {
        const parentElement = e.srcEvent.target.parentElement;
        option = parentElement.attributes.getNamedItem("parent").value;
        subOption = parentElement.attributes.getNamedItem("name").value;
        value = e.value;
      }
      updateSubField(value, option, subOption);
    },

    updateSubField(value, option, subOption) {
      const config = clone(this.plugin.config);
      config[option].config[subOption].value = value;

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config
      };

      this.$store.commit("module/savePlugin", payload);
    },
    mounted() {
      this.$store.dispatch('module/getLibraries', {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId
      });
    }
  }
};
</script>

<style>
.config-inner {
  padding-left: 10px;
}

.config-inner > * {
  padding-bottom: 5px;
}
</style>