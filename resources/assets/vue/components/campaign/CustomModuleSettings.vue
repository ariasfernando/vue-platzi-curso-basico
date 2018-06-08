<template>
  <div class="component-settings" v-if="module ? module.settings : false">
    <h2><i class="glyphicon glyphicon-tasks"></i> {{ module.title }} </h2>
    <div class="plugins">
      <div>
        <component :is="'custom-settings-' + module.key" :module-id="currentCustomModule" :module="module"></component>
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
