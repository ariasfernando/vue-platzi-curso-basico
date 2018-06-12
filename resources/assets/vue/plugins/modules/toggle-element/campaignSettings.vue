<template>
  <div class="plugin-wrapper-inner">
    <form class="form-horizontal">
      <div class="form-group">
        <div class="col-sm-8 pd-reset-right">
          <label>{{ plugin.title }}</label>
        </div>
        <div class="col-sm-2">
          <div v-for="element in plugin.data.elements" :key="element.id">
            <label>{{ element.label }}</label>
            <toggle-button
              :value="getValue(element.id)"
              @change="value => toggleChange(value, element.id)">
            </toggle-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import _ from 'lodash';
  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId', 'componentId', 'component', 'order'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
    },
    methods: {
      getValue(elementId){
        for (let columnId in this.module.structure.columns) {
          let column = this.module.structure.columns[columnId];
          for (let componentId in column.components) {
            if (this.module.structure.columns[columnId].components[componentId].id === _.parseInt(elementId)) {
              return this.module.structure.columns[columnId].components[componentId].container.styleOption.enableElement;
            }
          }
        }
      },
      toggleElement(value, elementId){
        for (let columnId in this.module.structure.columns) {
          let column = this.module.structure.columns[columnId];
          for (let componentId in column.components) {
            if (this.module.structure.columns[columnId].components[componentId].id === _.parseInt(elementId)) {
              const payload = {
                moduleId: this.moduleId,
                columnId,
                componentId,
                subComponent: 'container',
                link: "styleOption",
                property: 'enableElement',
                value: value
              };
              this.$store.commit("campaign/saveComponentProperty", payload);
              return;
            }
          }
        }
      },
      toggleChange(value, elementId) {
        if(this.plugin.data.preventEmpty && !value){
          let permitted = false;
          for (let i in this.plugin.data.elements) {
            if(this.plugin.data.elements[i].id !== elementId && this.getValue(this.plugin.data.elements[i].id)){
              this.toggleElement(value, elementId);
              return;
            }
          }
          this.$root.$toast("You've to leave at least one element",{
            className: 'et-error',
            horizontalPosition: 'right',
          });
        } else {
          this.toggleElement(value, elementId);
        }
      }
    }
  }
</script>