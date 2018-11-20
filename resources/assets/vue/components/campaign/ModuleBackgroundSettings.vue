<template>
  <div>
    <template
    v-for="(module, moduleKey) in $store.getters['campaign/modules']"
    >
      <component
        v-for="(plugin, pluginKey) in module.plugins"
        :key="moduleKey + pluginKey"
        v-if="isRenderSetting(plugin, pluginKey)"
        :is="'campaign-' + plugin.name"
        :name="pluginKey"
        :plugin="plugin"
        :module-id="moduleKey"
        :module="module">
      </component>
    </template>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    methods:{
      isRenderSetting(plugin, key){
        return plugin.enabled && plugin.runBackground && this.$_app.modulePlugins[key];
      }
    },
  }
</script>
