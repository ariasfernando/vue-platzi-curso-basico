<template>
  <div>
    <template v-for="(module) in modulesFiltered">
      <template v-for="(row) in module.structure.rows">
        <Component
          :is="'campaign-' + plugin.name"
          v-for="(plugin, pluginKey) in componentPluginsFiltered(module, row)"
          :key="`${getElementKey(module.idInstance, row.id)}-plugin-${plugin.name}`"
          :class="'plugin-' + plugin.name"
          :element-key="getElementKey(module.idInstance, row.id)"
          :element="row"
          :module="module"
          :current-element-key="currentElementKey"
          :name="plugin.name"
          :plugin-key="pluginKey"
          :plugin="plugin" />
      </template>
    </template>
  </div>
</template>

<script>

export default {
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    modulesFiltered() {
      return this.modules.filter(module => module.type === 'studio');
    },
    currentModule() {
      let module = false;
      _.forEach(this.modulesFiltered, (currentModule) => {
        if (currentModule.idInstance === this.currentModuleInstanceId) {
          module = currentModule;
          return false;
        }
        return true;
      });
      return module;
    },
    currentModuleInstanceId() {
      return this.$store.getters["campaign/currentModuleInstanceId"];
    },
    currentElementId() {
      return this.$store.getters["campaign/currentElementId"];
    },
    currentElement() {
      if(this.currentModuleInstanceId && this.currentElementId){
        let element = false;
        _.forEach(this.currentModule.structure.rows, (row) => {
          if (row.id === this.currentElementId) {
            element = row;
            return false;
          }
          _.forEach(row.columns, (column) => {
            if (column.id === this.currentElementId) {
              element = column;
              return false;
            }
            _.forEach(column.components, (currentComponent) => {
              if (currentComponent.id === this.currentElementId) {
                element = currentComponent;
                return false;
              }
              return true;
            });
            return !element;
          });
          return !element;
        });
        return element;
      }
      return undefined;
    },
    currentElementKey() {
      return this.currentElementId
        ? this.getElementKey(
          this.currentModuleInstanceId,
          this.currentElementId,
        )
        : undefined;
    },
    showModuleSettings() {
      return this.$store.getters['campaign/showModuleSettings'];
    },
    showCurrentSettings() {
      let show = false;
      if (this.currentElement) {
        _.each(this.currentElement.plugins, (plugin, pluginKey) => {
          if (
            plugin.enabled &&
            plugin.render !== false &&
            this.hasCampaignSettings(pluginKey)
          ) {
            show = true;
            return false;
          }
          return true;
        });
      }
      return show;
    },
  },
  methods: {
    isEnableOrRunBackground(plugin, pluginKey, elementKey) {
      return (
        plugin.enabled &&
        this.hasCampaignSettings(pluginKey) &&
        (this.currentElementKey === elementKey || plugin.runBackground)
      );
    },
    getElementKey(idInstance, elementId) {
      return `${idInstance}-${elementId}`;
    },
    hasCampaignSettings(key) {
      return (
        this.$_app.modulePlugins[key] &&
        this.$_app.modulePlugins[key].hasCampaignSettings
      );
    },
    componentPluginsFiltered(module, row) {
      const plugins = {};
      _.forOwn(row.plugins, (plugin, pluginKey) => {
        if (this.isEnableOrRunBackground(
          plugin, pluginKey,
          this.getElementKey(module.idInstance, row.id))) {
          plugins[pluginKey] = plugin;
        }
      });
      return plugins;
    },
  },
};
</script>
