<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>
    <div v-if="plugin.enabled">
      <settings-container label="Use Palette from Library">
        <template slot="setting-right">
            <toggle-button :value="this.plugin.config.usePaletteFromLibrary" @change="(newValue)=>updatePluginConfig(newValue,'usePaletteFromLibrary')"></toggle-button>
        </template>
      </settings-container>
      <settings-container label="Palette name" v-if="this.plugin.config.usePaletteFromLibrary">
        <template slot="setting-right">
            <el-input 
              size="mini"
              v-model="paletteFromLibrary"
              placeholder="name"
            ></el-input>
        </template>
      </settings-container>
      <settings-container v-else label="Custom Palette">
        <template slot="setting-right">
            <el-input
              size="mini"
              v-model="customPalette"
              placeholder="000000,474646,79A8C9,CD202C"
            ></el-input>
        </template>
      </settings-container>
    </div>
  </div>
</template>
<script>
  import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
  export default {
    props: ['name', 'columnId'],
    components: { SettingsContainer },
    computed: {
      module() {
        return this.$store.getters['module/module'];
      },
      plugin() {
        const plugin = this.module.plugins[this.name];
        this.enabled = plugin.enabled;

        return plugin;
      },
      paletteFromLibrary: {
        get() {
          return this.plugin.config.paletteName;
        },
        set(value) {
          this.updatePluginConfig(value,'paletteName');
        }
      },
      customPalette: {
        get() {
          return this.plugin.config.paletteMap.join(',');
        },
        set(value) {
          this.updatePluginConfig(value.split(","),'paletteMap');
        }
      },
    },
    data() {
      return {
        enabled: false,
      }
    },
    methods: {
      toggle(value) {
        const payload = {
          plugin: this.name,
          enabled: value,
        };

        this.$store.commit('module/togglePlugin', payload);
      },
      updatePluginConfig(value, option) {
        const config = {};

        _.set(config, option, value);

        const payload = {
          plugin: this.name,
          config,
        };
        
        this.$store.commit('module/savePlugin', payload);
      },
    },
  }
</script>