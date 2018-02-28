<template>
  <div class="plugin-wrapper-inner">
    <label>{{ plugin.title }}</label>
    <form class="form-horizontal">
      <div class="form-group">
        <div class="half-style-setting padding-top">
          <span class="st-toogle">
            <toggle-button :value="component.attribute.hideElement" color="#78DCD6" :sync="true" :labels="true" @change="toggleChange"></toggle-button>
          </span>
        </div>
      </div>
    </form>
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
      toggleChange(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'hideElement',
          attributeValue: e.value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
      
    },
  }

</script>

<style lang="less">

.plugin-wrapper-inner{
  .form-group{

    margin-bottom: 0px !important;

    .st-toogle{
      width: 34px !important;
    }
  }
}

</style>
