<template>
  <tbody>
    <tr v-if="module.type === 'custom'" class="st-module-wrapper" :class="{ 'st-module-wrapper-active': activeModule === moduleId }" @click="setActiveModule(moduleId)">
      <td class="st-toolbar-content st-position-relative">
        <component :is="'custom-' + module.name" :module="module" :module-id="moduleId"></component>
        <module-toolbar :module-id="moduleId"></module-toolbar>
      </td>
    </tr>

    <tr v-else class="st-module-wrapper" :class="{ 'st-module-wrapper-active': activeModule === moduleId }" @click="setActiveModule(moduleId)">
      <td class="st-toolbar-content st-position-relative"
          :style="module.structure.style"
          :bgcolor="module.structure.attribute.bgcolor.hex"
          :class="[module.structure.columns.length > 1 ? 'st-wrapper-content' : '']">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" :class="{ 'stx-wrapper': module.structure.columns.length === 1 }">
          <!--2 COLUMNS -->
          <tr v-if="module.structure.columns.length > 1">
            <td width="100%" v-if="!module.structure.columnsFixed">
              <comment :content="msoStartingComment"></comment>
              <columns-stacked-render v-for="(column, columnId) in module.structure.columns" :key="columnId" :module-id="moduleId" :column="column" :column-id="columnId"></columns-stacked-render>
            </td>

            <td v-else
                v-for="(column, columnId) in module.structure.columns"
                :width="column.attribute && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'"
                valign="top"
            >
              <columns-fixed-render :column="column" :column-id="columnId" :module-id="moduleId"></columns-fixed-render>
            </td>
          </tr>
          <!--2 COLUMNS -->

          <!--1 COLUMN -->
          <tr v-else v-for="(component, componentId) in module.structure.columns[0].components" @click.prevent="setComponent(moduleId, 0, componentId)">
            <td :valign="component.attribute.valign" :align="component.attribute.align || 'left'">
              <component
                :is="component.type"
                :component="component"
                :module-id="moduleId"
                :column-id="0"
                :component-id="componentId">
              </component>
            </td>
          </tr>
          <!--1 COLUMN -->
        </table>
        <module-toolbar :module-id="moduleId"></module-toolbar>
        <div class="st-remove-element module-overlay"></div>
      </td>
    </tr>
  </tbody>
</template>

<script>

  import TextElement from './elements/TextElement.vue';
  import ButtonElement from './elements/ButtonElement.vue';
  import ImageElement from './elements/ImageElement.vue';
  import DividerElement from './elements/DividerElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import ColumnsStackedRender from './partials/ColumnsStackedRender.vue';
  import ColumnsFixedRender from './partials/ColumnsFixedRender.vue';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      templateWidth() {
        return this.$store.getters["campaign/campaign"].library_config.templateWidth;
      },
      msoStartingComment() {
        return "[if gte mso 9]>" +
          "<table width='" + this.templateWidth + "' cellpading='0' cellspacing='0' border='0' style='border-collapse: collapse; table-width: fixed;' align='center'>" +
          "<tr>" +
          "<td style='width: " + this.templateWidth / this.module.structure.columns.length + "px !important'>" +
          "<![endif]";
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
    },
    methods: {
      setComponent(moduleId, columnId, componentId) {
        setTimeout(() => {
          // TODO: find better way to do this
          this.$store.commit("campaign/setCurrentComponent", {
            moduleId,
            columnId,
            componentId,
          });
        }, 50);
      },
      setActiveModule(moduleId) {
        // Set active Module
        this.$store.commit("campaign/setActiveModule", moduleId);
        // Clear 3rd column
        this.$store.commit("campaign/setCurrentComponent", {});
        this.$store.commit("campaign/setCurrentModule", null);
      }
    },
    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      ModuleToolbar,
      ColumnsStackedRender,
      ColumnsFixedRender
    }
  };
</script>
