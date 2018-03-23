<template>
  <div>

    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="plugin.enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <template v-if="plugin.enabled" v-for="(option, name) in plugin.config" >
      <settings-container :label="option.label" :key="name">
        <template slot="setting-right">
          <toggle-button v-if="option.type === 'switch'" :disabled="!enabled" :value="option.value" @change="(newValue)=>updateField(newValue, name)"></toggle-button>
          <el-input-number
            v-if="option.type === 'number'" 
            size="mini" 
            v-validate="'required'"
            :value="option.value" 
            @change="(newValue)=>updateField(newValue, name)"
            :min="0"
          ></el-input-number>
          <el-input size="mini" v-if="option.type === 'text'" :disabled="!enabled" :value="option.value" @change="(newValue)=>updateField(newValue, name)"></el-input>
          <el-select size="mini" v-if="option.type === 'select' || option.type === 'multi-select'" @change="(newValue)=>updateField(newValue, name)" :value="option.value" :multiple="option.type === 'multi-select'">
            <el-option v-for="(opt, key) in option.options" :value="opt._id ? opt._id : opt"  :key="key" :label="opt.name ? opt.name : opt "></el-option>
          </el-select>
        </template>
      </settings-container>
      <settings-container v-if="option.value && option.config" v-for="(subopt, subname) in option.config" :label="subopt.label" :key="subname">
        <template slot="setting-right">
          <toggle-button v-if="subopt.type === 'switch'" :value="subopt.value" active-color="#78DCD6" @change="(newValue)=>updateSubField(newValue, name, subname)"></toggle-button>
          <el-input size="mini"  v-if="subopt.type === 'text'" :value="subopt.value" @change="(newValue)=>updateSubField(newValue, name, subname)"></el-input>
          <el-input-number
            v-if="subopt.type === 'number'" 
            size="mini" 
            v-validate="'required'"
            :value="subopt.value" 
            @change="(newValue)=>updateSubField(newValue, name, subname)"
            :min="subname === 'padding' ? 0 : 10"
          ></el-input-number>
          <el-select v-model="subopt.value" multiple v-if="subopt.type === 'multi-select'" :value="subopt.value" :parent="name" :name="subname">
            <el-option v-for="opt in subopt.options" :key="opt" :label="opt" :value="opt"></el-option>
          </el-select>
        </template>
      </settings-container>
    </template>
  </div>
</template>

<script>
import clone from "clone";
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