<template>

  <tr v-if="module.type === 'custom'" class="st-module-wrapper" @click="activateModule();">
    <td class="st-toolbar-content st-position-relative">
      <component :is="'custom-' + module.name" :module="module" :module-id="moduleId"></component>
      <module-toolbar :module-id="moduleId"></module-toolbar>
    </td>
  </tr>

  <tr v-else class="st-module-wrapper" @click="activateModule();">
    <td class="st-toolbar-content st-position-relative"
        :style="module.structure.style"
        :bgcolor="module.structure.attribute.bgcolor.hex"
        :class="[module.structure.columns.length > 1 ? 'st-wrapper-content' : '']"
    >
      <table width="100%" cellspacing="0" cellpadding="0" border="0">
        <!--2 COLUMNS -->
        <tr v-if="module.structure.columns.length > 1">
          <td width="100%" 
              v-if="!module.structure.columnsFixed"
          >

            <comment :content="msoStartingComment"></comment>
            <columns-stacked-render v-for="(column, columnId) in module.structure.columns" :key="columnId" :module-id="moduleId" :column="column" :column-id="columnId"></columns-staked-render>
            
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
        <tr v-else v-for="(component, componentId) in module.structure.columns[0].components">
          <td :valign="component.attribute.valign"
              :align="component.attribute.align || 'left'"
          >
              <component :is="component.type"
                         :component="component"
                         :module-id="moduleId"
                         :column-id="0"
                         :component-id="componentId"></component>
          </td>
        </tr>
        <!--1 COLUMN -->
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
      }
    },
    methods: {
      setComponent(ref) {
        this.$store.commit("campaign/setCurrentComponent", ref);
      },
      activateModule(){
        var module = document.querySelectorAll('.st-module-wrapper');

        var active;

        for (var i = 0; i < module.length; i++){
          module[i].addEventListener('click', function(evt){

            if (active) { active.classList.remove('st-module-wrapper-active') }

            evt.currentTarget.classList.add('st-module-wrapper-active');

            active = evt.currentTarget

          });
        }
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
