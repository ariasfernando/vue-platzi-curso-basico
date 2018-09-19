<template>
  <div v-if="module ? module.settings : false">
    <label-item-container
    :label="title"
    icon="glyphicon-tasks"
    :collapsable="false"
    ></label-item-container>
    <div class="card">
      <group-container>
        <component :is="'custom-settings-' + module.key" :module-id="currentCustomModule" :module="module"></component>
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
    computed: {
      title() {
        if (this.currentCustomComponent.customKey && this.module.components
          && this.module.components[this.currentCustomComponent.customKey]) {
          return this.module.components[this.currentCustomComponent.customKey].title;
        }
        return this.module.title;
      },
      currentCustomModule() {
        return this.$store.getters["campaign/currentCustomModule"];
      },
      currentCustomComponent() {
        return this.$store.getters["campaign/currentCustomComponent"];
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
