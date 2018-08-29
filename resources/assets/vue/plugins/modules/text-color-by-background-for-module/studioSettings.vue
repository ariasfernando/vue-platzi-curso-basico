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
    props: ['name', 'plugin'],
    components: { SettingsContainer },
    methods: {
      toggle(value) {
        const payload = {
          plugin: this.name,
          enabled: value,
        };

        this.$store.commit('module/togglePlugin', payload);
      }
    }
  }
</script>
