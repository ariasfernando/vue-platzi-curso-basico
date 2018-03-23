<template>
  <div class="plugin-wrapper-inner">
    <label>{{ plugin.title }}</label>
    <toggle-button :value="component.attribute.hideElement" color="#78DCD6" :sync="true" :labels="true" @change="toggleChange"></toggle-button>
  </div>
</template>

<script>

export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
    },
    methods: {
      toggleChange(value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'hideElement',
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
      
    },
  }

</script>

<style lang="less">

.plugin-wrapper-inner{
    span.el-switch__button {
      display: inherit !important;
      width: 16px !important;
    }
}

</style>
