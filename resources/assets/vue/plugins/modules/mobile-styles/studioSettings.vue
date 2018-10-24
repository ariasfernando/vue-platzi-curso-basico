<template>
  <div>
    <settings-container v-for="(mobileSetting, key) in plugin.config.settings" :label="mobileSetting.title" :key="key">
      <template slot="setting-right">
        <toggle-button :value="mobileSetting.value" @change="(newValue)=>toggleSetting(newValue,key)" />
      </template>
    </settings-container>
  </div>
</template>

<script>
  import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

  export default {
    components: { SettingsContainer },
    props: ['name', 'plugin'],
    data() {
      return {
        enabled: this.plugin.enabled,
        options: this.plugin.config.options,
      };
    },
    computed: {
      currentComponent() {
        return this.$store.getters['module/currentComponent'];
      },
      module() {
        return this.$store.getters['module/module'];
      },
    },
    methods: {
      toggleSetting(value, setting) {
        const options = {};
        options[setting] = {
          value,
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            settings: options,
          },
        };

        // Save plugin data
        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>
