<template>
  <div class="component-settings" v-if="component">
    <label-item-container
      v-if="ready && component.plugins && Object.keys(component.plugins).length !== 0"
      :label="toCamel(component.type.replace('-element', ''))"
      icon="glyphicon-tasks"
      :collapsable="false"
    ></label-item-container>
    <div class="card">
      <group-container>
        <div v-for="(plugin, key) in component.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name" :key="'plugin-' + plugin.name">
          <component v-if="plugin.enabled && plugin.name !=='text-options'" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"></component>
        </div>
      </group-container>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
import GroupContainer from "../common/containers/GroupContainer.vue";
import LabelItemContainer from "../common/containers/LabelItemContainer.vue";

  export default {
    data () {
      return {
        ready: false,
      }
    },
    components: {
      GroupContainer,
      LabelItemContainer,
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        this.ready = false;

        if (Object.keys(this.currentComponent).length !== 0) {

          const modules = this.$store.getters["campaign/modules"];

          if (modules.length !== 0 && Object.keys(this.currentComponent).length !== 0) {
            const moduleId = this.currentComponent.moduleId;
            const columnId = this.currentComponent.columnId;
            const componentId = this.currentComponent.componentId;

            if (!modules[moduleId]) {
              this.ready = false;
              return component;
            }

            if ( _.has(this.$store.getters["campaign/modules"][moduleId], 'structure') && this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId]){
              component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
            }

            if (component) {
              _.each(component.plugins, (plugin) => {
                if (plugin.enabled && plugin.render !== false) {
                  this.ready = true;
                }
              });
            }
          }
        }
        return component;
      },
    },
    methods: {
      toCamel(str) {
        return _.startCase(str);
      },
      saveComponent() {
        this.$store.commit('campaign/saveComponent', {
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          component: this.component
        });
      },
      unsetCustomModule() {
        this.$store.commit("campaign/setCustomModule", undefined);
      }
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>
