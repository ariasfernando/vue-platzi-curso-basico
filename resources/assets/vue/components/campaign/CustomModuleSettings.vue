<template v-if="module ? module.settings : false">
  <div>
    <label-item-container
    :label="module.title"
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
