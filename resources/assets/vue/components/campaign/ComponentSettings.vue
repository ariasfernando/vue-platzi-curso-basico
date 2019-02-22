<template>
  <div>
    <LabelItemContainer
      v-if="showCurrentSettings"
      :label="toCamel(currentElement.type.replace('-element', ''))"
      icon="glyphicon-tasks"
      :collapsable="false" />
    <div class="card card-custom" :class="{hidden: !showCurrentSettings}">
      <GroupContainer ref="component-settings-group" class="group-container-custom">
        <template v-for="(module, moduleId) in modulesFiltered">
          <template v-for="(column, columnId) in module.structure.columns">
            <template v-for="(component, componentId) in column.components">
              <Component
                :is="'campaign-' + plugin.name"
                v-for="(plugin, pluginKey) in componentPluginsFiltered(module, component)"
                :key="`${getElementKey(module ,component)}-plugin-${plugin.name}`"
                :class="'plugin-' + plugin.name"
                :element-key="getElementKey(module ,component)"
                :element-location="{columnId, componentId ,moduleId}"
                :element="component"
                :module="module"
                :current-element-key="currentElementKey"
                :name="plugin.name"
                :plugin-key="pluginKey"
                :plugin="plugin" />
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
    currentComponent() {
      return this.$store.getters['campaign/currentComponent'];
    },
    currentElement() {
      if (Object.keys(this.currentComponent).length !== 0) {
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;
        return this.$store.getters['campaign/modules'][moduleId].structure
          .columns[columnId].components[componentId];
      }
      return undefined;
    },
    currentElementKey() {
      return this.currentElement
        ? this.getElementKey(
          this.modules[this.currentComponent.moduleId],
          this.currentElement,
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
          }
        });
      }
      return show;
    },
  },
  updated() {
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
  methods: {
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
    getElementKey(module, element) {
      return `${module.idInstance}-${element.id}`;
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
          this.getElementKey(module, component))) {
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
