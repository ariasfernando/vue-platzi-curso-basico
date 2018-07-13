<template>
  <div>
    <component
    v-for="(plugin, key) in module.plugins"
    :key="plugin.name + key"
    v-if="isRenderSetting(plugin)"
    :is="'campaign-' + plugin.name"
    :name="key"
    :plugin="plugin"
    :module-id="activeModule"></component>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.activeModule];
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
      isRenderSetting(plugin){
        return plugin.enabled && plugin.runBackground && this.$_app.modulePlugins[key] && this.activeModule !== undefined
      }
    },
  }
</script>