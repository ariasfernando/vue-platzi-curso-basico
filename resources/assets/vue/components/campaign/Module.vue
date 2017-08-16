<template >
  <tr v-if="module.type === 'custom'" class="st-module-wrapper">  
    <td class="st-toolbar-content st-position-relative">
      <div v-html="module.template"></div>
      <module-toolbar :module-id="moduleId"></module-toolbar>
    </td>
  </tr>  

  <tr v-else class="st-module-wrapper">
    <td class="st-toolbar-content st-position-relative"
        :style="module.structure.style" 
        :class="[module.structure.columns.length > 1 ? 'st-wrapper-content' : '']"
    >
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr v-if="module.structure.columns.length > 1">
          <th class="st-col" v-for="(column, columnId) in module.structure.columns" :width="column.style.width"
              :style="column.style">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr v-for="(component, componentId) in column.components">
                <td width="100%" :align="component.attribute.align || 'center'">
                    <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId"
                               :component-id="componentId"></component>
                </td>
              </tr>
            </table>
          </th>
        </tr>
        <tr v-else>
          <td v-for="(column, columnId) in module.structure.columns" :width="column.style.width" :style="column.style">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr v-for="(component, componentId) in column.components">
                <td width="100%" :align="component.attribute.align || 'center'">
                    <component :is="component.type" :component="component" :module-id="moduleId" :column-id="columnId"
                               :component-id="componentId"></component>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <module-toolbar :module-id="moduleId"></module-toolbar>
    </td>
  </tr>  
</template>

<script>

  import TextElement from './elements/TextElement.vue';
  import ButtonElement from './elements/ButtonElement.vue';
  import ImageElement from './elements/ImageElement.vue';
  import DividerElement from './elements/DividerElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      module() {
        return this.modules[this.moduleId];
      }
    },
    methods: {
      setComponent(ref) {
        this.$store.commit("campaign/setCurrentComponent", ref);
      },
    },
    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      'module-toolbar': ModuleToolbar,
    }
  };
</script>
