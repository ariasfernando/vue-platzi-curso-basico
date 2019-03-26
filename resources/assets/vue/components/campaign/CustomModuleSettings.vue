<template>
  <div v-if="module && module.type === 'custom'">
    <label-item-container
    :label="title"
    icon="glyphicon-tasks"
    :collapsable="false"
    ></label-item-container>
    <div class="card card-custom">
      <group-container class="group-container-custom">
        <component :is="'custom-settings-' + module.key" :module-id="moduleIndex" :module="module"></component>
      </group-container>
    </div>
  </div>
</template>

<script>
  import GroupContainer from "../common/containers/GroupContainer.vue";
  import LabelItemContainer from "../common/containers/LabelItemContainer.vue";

  export default {
    components: {
      GroupContainer,
      LabelItemContainer,
    },
    computed: {
      title() {
        if (this.currentCustomComponent.customKey && this.module.components
          && this.module.components[this.currentCustomComponent.customKey]) {
          return this.module.components[this.currentCustomComponent.customKey].title;
        }
        return this.module.title;
      },
      currentCustomComponent() {
        return this.$store.getters["campaign/currentCustomComponent"];
      },
      modules() {
        return this.$store.getters['campaign/modules'];
      },
      currentModuleIdInstance() {
        return this.$store.getters["campaign/currentModuleIdInstance"];
      },
      moduleIndex() {
        let moduleIndex = false;
        _.forEach(this.modules, (currentModule, currentModuleIndex) => {
          if (currentModule.idInstance === this.currentModuleIdInstance) {
            moduleIndex = currentModuleIndex;
            return false;
          }
          return true;
        });
        return moduleIndex;
      },
      module() {
        let module = false;
        _.forEach(this.modules, (currentModule) => {
          if (currentModule.idInstance === this.currentModuleIdInstance) {
            module = currentModule;
            return false;
          }
          return true;
        });
        return module;
      },
    },
    methods: {
      toCamel(str) {
        return _.startCase(str);
      },
    }
  }
</script>

<style lang="less" scoped>
  .card-custom {
    padding-bottom: 0;
  }
  .group-container-custom {
    margin: 5px 0 15px;
}
</style>
