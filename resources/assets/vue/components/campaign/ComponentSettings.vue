<template>
  <div class="component-settings section-box" v-if="ready">
    <h2><i class="glyphicon glyphicon-pencil"></i> STYLES</h2>
    <div class="plugins">
      <div v-for="(plugin, key) in component.plugins" class="plugin-wrapper" :class="'plugin-' + plugin.name">
        <component v-if="plugin.enabled && $globalComponents.indexOf('campaign-' + plugin.name) !== -1" :is="'campaign-' + plugin.name" :name="key" :plugin="plugin"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import uc from 'underscore-contrib'
  import defaultElements from '../../resources/elements'

  export default {
    data () {
      return {
        ready: false,
        component: {}
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    watch : {
      currentComponent: {
        handler: function() {
          let modules = this.$store.getters["campaign/modules"];
          if (!_.isEmpty(this.currentComponent)) {
            this.component = modules[this.currentComponent.moduleId].structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
            this.ready = true;
          }
        },
        deep: true
      },
    },
    methods: {
      saveComponent() {
        this.$store.commit('campaign/saveComponent', {
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          component: this.component
        });
      },
      changeSetting(key, setting) {
        setting.value = !setting.value;
        this.component.settings[key] = setting;
        this.saveComponent();
      },
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }

  .plugin-wrapper {
    margin-bottom: 10px;
  }
</style>