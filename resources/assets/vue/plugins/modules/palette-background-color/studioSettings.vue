<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <settings-container v-if="plugin.enabled" label="Palette">
      <template slot="setting-right">
          <el-input
            size="mini" 
            v-validate="'required'"
            v-model="bgColorMap"
            placeholder="000000,474646,79A8C9,CD202C"
            class="clearfix"
          ></el-input>
      </template>
    </settings-container>
  </div>
</template>
<script>
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  export default {
    props: ['name'],
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

        const plugin = module.structure.columns[columnId].components[componentId].plugins[this.name];
        this.enabled = plugin.enabled;

        return plugin;
      },
      bgColorMap: {
        get() {
          return this.plugin.config.options.bgcolor.palette.join(',');
        },
        set(value) {
          this.changeOption(value.split(","),'palette','bgcolor');
        }
      },
    },
    data() {
      return {
        enabled: false
      }
    },
    methods: {
      toggle(value) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: value,
        };

        this.$store.commit('module/togglePlugin', payload);
      },
      changeOption(value,setting,subOption) {
        const option = {};
        option[subOption] = {};
        option[subOption][setting] = value;

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            options: option
          },
          subOption: subOption
        };

        // Save plugin data
        this.$store.commit("module/savePluginSuboption", payload);
      },
    }
  }
</script>