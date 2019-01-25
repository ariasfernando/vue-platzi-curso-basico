<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
        <toggle-button :value="plugin.enabled" @change="toggle"></toggle-button>
    </template>
  </settings-container>
</template>
<script>
  import SettingsContainer from "stensul/components/common/settings/containers/SettingsContainer.vue";

  export default {
    props: ['name', 'columnId'],
    components: { SettingsContainer },
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const plugin = this.module.structure.columns[this.columnId].plugins[this.name];
        this.enabled = plugin.enabled;

        return plugin;
      }
    },
    methods: {
      toggle(value) {
        const payload = {
          columnId: this.columnId,
          plugin: this.name,
          enabled: value,
        };

        this.$store.commit('module/togglePlugin', payload);
      }
    }
  }
</script>
