<template>
  <div class="component-settings" v-if="ready && module.type === 'custom' && module.settings">
    <h2><i class="glyphicon glyphicon-tasks"></i> {{ toCamel(module.params.title) }} </h2>
    <div class="plugins">
      <div>
        <component v-if="$customSettings.indexOf('custom-settings-' + module.name) !== -1" :is="'custom-settings-' + module.name" :module="module"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    data () {
      return {
        ready: false,
      }
    },
    computed: {
      currentCustomModule() {
        return this.$store.getters["campaign/currentCustomModule"];
      },
      module() {
        const modules = this.$store.getters["campaign/modules"];
        this.ready = false;

        if (modules[this.currentCustomModule]) {
          this.ready = true;
          return modules[this.currentCustomModule];
        }
      }
    },
    watch : {
      currentCustomModule: {
        handler: function(moduleId) {
          const modules = this.$store.getters["campaign/modules"];
          this.ready = false;

          if (modules[moduleId]) {
            this.module = modules[moduleId];
            this.ready = true;
          }
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