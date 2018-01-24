<template>
  <div class="component-settings" v-if="component">
    <h2 v-if="ready && component.plugins && Object.keys(component.plugins).length !== 0">
      <i class="glyphicon glyphicon-tasks"></i>
      {{ toCamel(component.type.replace('-element', '')) }}
    </h2>
    <div class="plugins">
      <div v-for="(plugin, key) in component.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
        <component v-if="plugin.enabled" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import uc from 'underscore-contrib'

  export default {
    data () {
      return {
        ready: false,
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        this.ready = false;

        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];

          if (component) {
            _.each(component.plugins, (plugin) => {
              if (plugin.enabled && plugin.render !== false) {
                this.ready = true;
              }
            });
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
