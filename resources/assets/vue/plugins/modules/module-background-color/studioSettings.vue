<template>
  <settings-container :label="modulePlugin.title">
    <template slot="setting-right">
        <toggle-button :value="modulePlugin.enabled" @change="toggle"></toggle-button>
    </template>
  </settings-container>
</template>
<script>
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import pluginMixin from '../mixins/pluginMixin';
  export default {
    props: ['name'],
    components: { SettingsContainer },
    mixins: [pluginMixin],
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
