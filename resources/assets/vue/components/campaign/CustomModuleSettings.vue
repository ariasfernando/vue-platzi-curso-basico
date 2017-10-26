<template>
  <div class="component-settings" v-if="module.settings">
    <h2><i class="glyphicon glyphicon-tasks"></i> {{ toCamel(module.params.title) }} </h2>
    <div class="plugins">
      <div>
        <component v-if="$customSettings.indexOf('custom-settings-' + module.name) !== -1" :is="'custom-settings-' + module.name" :module-id="currentCustomModule" :module="module"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    computed: {
      currentCustomModule() {
        return this.$store.getters["campaign/currentCustomModule"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentCustomModule];
      }
    },
    watch : {
      currentCustomModule: {
        handler: function(moduleId) {
          return this.$store.getters["campaign/modules"][moduleId];
        },
        deep: true
      },
    },
    methods: {
      toCamel(str) {
        return _.startCase(str);
      },
    }
  }
</script>

<style lang="less">
  .vue-js-switch {
    margin-top: 4px
  }
</style>