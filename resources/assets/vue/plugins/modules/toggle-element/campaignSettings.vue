<template>
  <div class="plugin-wrapper-inner" v-if="module">
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
        return this.$store.getters["campaign/modules"][typeof this.currentCustomModule === 'undefined' ? this.moduleId : this.currentCustomModule];
      },
      isCustom() {
        return typeof this.currentCustomModule !== 'undefined'
      },
      currentCustomModule() {
        return this.$store.getters["campaign/currentCustomModule"];
      },
    },
    methods: {
      getElement(elementId){
        if (!this.isCustom) {
          for (let columnId in this.module.structure.columns) {
            let column = this.module.structure.columns[columnId];
            for (let componentId in column.components) {
              if (this.module.structure.columns[columnId].components[componentId].id === _.parseInt(elementId)) {
                return {element: this.module.structure.columns[columnId].components[componentId].container.styleOption, columnId, componentId};
              }
            }
          }
        } else {
          return {element: this.module.data[elementId]};
        }
      },
      getValue(elementId){
        return this.getElement(elementId).element.enableElement;
      },
      toggleElement(value, elementId){
        if (this.isCustom) {
          let data = {};
          data[elementId] = {"enableElement" : value}
          this.$store.commit('campaign/saveCustomModuleData', {
            moduleId: this.currentCustomModule,
            data,
          });
        } else {
          const element = this.getElement(elementId)
          const payload = {
            moduleId: this.moduleId,
            columnId: element.columnId,
            componentId: element.componentId,
            subComponent: 'container',
            link: "styleOption",
            property: 'enableElement',
            value: value
          };
          this.$store.commit("campaign/saveComponentProperty", payload);
          return;
        }
      },
      toggleChange(value, elementId) {
        if(this.plugin.data.preventEmpty && !value){
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