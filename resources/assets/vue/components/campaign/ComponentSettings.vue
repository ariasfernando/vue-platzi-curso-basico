<template>
  <div>
    <label-item-container
      v-if="showCurrentSettings"
      :label="toCamel(currentElement.type.replace('-element', ''))"
      icon="glyphicon-tasks"
      :collapsable="false"
    ></label-item-container>
    <div class="card card-custom" :class="{hidden: !showCurrentSettings}">
      <group-container class="group-container-custom">
        <template v-for="(module, moduleId) in modules" v-if="module.type === 'studio'">
          <template v-for="(column, columnId) in module.structure.columns">
            <template v-for="(component, componentId) in column.components">
              <component
                v-for="(plugin, pluginKey) in component.plugins"
                v-if="isEnableOrRunBackground(plugin, pluginKey, getElementKey(module ,component))"
                :is="'campaign-' + plugin.name"
                :class="'plugin-' + plugin.name"
                :element-key="getElementKey(module ,component)"
                :element-location="{columnId, componentId ,moduleId}"
                :element="component"
                :module="module"
                :current-element-key="currentElementKey"
                :name="plugin.name"
                :plugin-key="pluginKey"
                :plugin="plugin"
                :key="`${getElementKey(module ,component)}-plugin-${plugin.name}`"
              ></component>
            </template>
          </template>
        </template>
      </group-container>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import GroupContainer from "../common/containers/GroupContainer.vue";
import LabelItemContainer from "../common/containers/LabelItemContainer.vue";

  export default {
    components: {
      GroupContainer,
      LabelItemContainer,
    },
    data () {
      return {
        ready: false,
      }
    },
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"]
      },
      currentElement() {
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;
          return this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId]
        }
        return;
      },
      currentElementKey() {
        return this.currentElement ? `${this.modules[this.currentComponent.moduleId].idInstance}-${this.currentElement.id}` : undefined;
      },
      showModuleSettings() {
        return this.$store.getters["campaign/showModuleSettings"];
      },
      showCurrentSettings() {
        let show = false
        if (this.currentElement) {
          _.each(this.currentElement.plugins, (plugin, pluginKey) => {
            if (plugin.enabled && plugin.render !== false && this.$_app.modulePlugins[pluginKey].hasCampaignSettings) {
              show = true;
            }
          });
        }
        return show;
      },
    },
    methods: {
      toCamel(str) {
        return _.startCase(str);
      },
      isEnableOrRunBackground(plugin, pluginKey, elementKey) {
        const hasCampaignSettings = this.$_app.modulePlugins[pluginKey].hasCampaignSettings
        return plugin.enabled && hasCampaignSettings && ( this.currentElementKey === elementKey || plugin.runBackground)
      },
      getElementKey(module, element) {
        return `${module.idInstance}-${element.id}`;
      },
    }
  }
</script>

<style lang="less" scoped>
  .vue-js-switch {
    margin-top: 4px
  }
  .card-custom {
    padding-bottom: 0;
  }
  .group-container-custom {
    margin: 5px 0 15px;
}
</style>
