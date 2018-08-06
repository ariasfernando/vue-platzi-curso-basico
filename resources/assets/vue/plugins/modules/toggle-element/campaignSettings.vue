<template>
  <settings-container :label="plugin.title" v-if="module" level="first">
    <template slot="setting-bottom">
      <settings-container :label="element.label" v-for="element in plugin.data.elements" :key="element.id">
        <template slot="setting-half">
          <toggle-button
            :value="getValue(element.id)"
            @change="value => toggleChange(value, element.id)">
          </toggle-button>
        </template>
      </settings-container>
    </template>
  </settings-container>
</template>

<script>
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import validatorMixin from '../mixins/validator.js';
  import _ from 'lodash';
  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId', 'componentId', 'component', 'order'],
    mixins: [ validatorMixin ],
    components: { SettingsContainer },
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
            this.$store.dispatch("campaign/updateCustomElementProperty", {
              moduleId: this.currentCustomModule,
              subComponent: elementId,
              property: 'enableElement',
              value: value
          });
          this.resetErrors(value,this.currentCustomModule);
        } else {
          const element = this.getElement(elementId);
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
          this.resetErrors(value,this.moduleId);
        }
        this.$emit('changed', {
          elementId: elementId,
          value: value
        });
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
      },
      resetErrors(value, moduleId) {
        this.$store.commit('campaign/clearErrorsByModuleId', moduleId);
        if (this.isCustom) {
          this.registerCustomModuleDefaultValidationErrors();
        } else {
          this.registerStudioModuleDefaultValidationErrors();
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.settings-container .el-switch{
  float: left;
}
</style>
