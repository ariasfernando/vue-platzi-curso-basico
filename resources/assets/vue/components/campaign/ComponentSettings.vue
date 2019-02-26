<template>
  <div v-show="showCurrentSettings && !showModuleSettings">
    <LabelItemContainer
      v-if="showCurrentSettings"
      :label="toCamel(currentElement.type.replace('-element', ''))"
      icon="glyphicon-tasks"
      :collapsable="false" />
    <div class="card card-custom">
      <GroupContainer ref="component-settings-group" class="group-container-custom">
        <template v-for="(module, moduleId) in modulesFiltered">
          <template v-for="(row, rowId) in module.structure.rows">
            <template v-for="(column, columnId) in row.columns">
              <template v-for="(component, componentId) in column.components">
                <Component
                  :is="'campaign-' + plugin.name"
                  v-for="(plugin, pluginKey) in componentPluginsFiltered(module, component)"
                  :key="`${getElementKey(module.idInstance, component.id)}-plugin-${plugin.name}`"
                  :class="'plugin-' + plugin.name"
                  :element-key="getElementKey(module.idInstance, component.id)"
                  :element-location="{rowId, columnId, componentId ,moduleId}"
                  :element="component"
                  :module="module"
                  :current-element-key="currentElementKey"
                  :name="plugin.name"
                  :plugin-key="pluginKey"
                  :plugin="plugin" />
              </template>
            </template>
          </template>
        </template>
      </GroupContainer>
    </div>
  </div>
</template>

<script>
import GroupContainer from '../common/containers/GroupContainer.vue';
import LabelItemContainer from '../common/containers/LabelItemContainer.vue';

export default {
  components: {
    GroupContainer,
    LabelItemContainer,
  },
  data() {
    return {
      ready: false,
    };
  },
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
        if (currentModule.idInstance === this.currentModuleIdInstance) {
          module = currentModule;
          return false;
        }
        return true;
      });
      return module;
    },
    currentModuleIdInstance() {
      return this.$store.getters["campaign/currentModuleIdInstance"];
    },
    currentElementId() {
      return this.$store.getters["campaign/currentElementId"];
    },
    currentElement() {
      if(this.currentModuleIdInstance && this.currentElementId){
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
          this.currentModuleIdInstance,
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
  updated() {
    this.addClassToFirstSettingContainer()
  },
  methods: {
    addClassToFirstSettingContainer() {
      const groupContainer = this.$refs['component-settings-group'].$el;
      const childElements = groupContainer.children;
      // add class to first visible setting-container
      if (childElements) {
        for (let i = 0; i < childElements.length; i++) {
          if (
            childElements[i].classList &&
            (childElements[i].classList.contains('settings-container') ||
            childElements[i].classList.contains('settings-wrapper')) &&
            childElements[i].style.display !== 'none'
          ) {
            const prevElement = childElements[i].previousElementSibling;
            if (
              prevElement &&
              prevElement.classList &&
              (prevElement.classList.contains('settings-container') ||
              prevElement.classList.contains('settings-wrapper')) &&
              prevElement.style.display === 'none'
            ) {
              childElements[i].classList.add('is-first');
              break;
            }
          }
        }
      }
    },
    toCamel(str) {
      return _.startCase(str);
    },
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
    componentPluginsFiltered(module, component) {
      const plugins = {};
      _.forOwn(component.plugins, (plugin, pluginKey) => {
        if (this.isEnableOrRunBackground(
          plugin, pluginKey,
          this.getElementKey(module.idInstance, component.id))) {
          plugins[pluginKey] = plugin;
        }
      });
      return plugins;
    },
  },
};
</script>

<style lang="less" scoped>
.card-custom {
  padding-bottom: 0;
}
.group-container-custom {
  margin: 5px 0 15px;
}
</style>
