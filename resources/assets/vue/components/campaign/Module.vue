<template>

  <tr v-if="module.type === 'custom'" class="st-module-wrapper">
    <td class="st-toolbar-content st-position-relative">
      <component v-if="$_app.customModules.indexOf('custom-' + module.name) !== -1" :is="'custom-' + module.name" :module="module" :module-id="moduleId"></component>
      <module-toolbar :module-id="moduleId"></module-toolbar>
    </td>
  </tr>

  <tr v-else class="st-module-wrapper">
    <td class="st-toolbar-content st-position-relative"
        :style="[module.structure.columns.length > 1 ? module.structure.style : '']"
        :bgcolor="module.structure.attribute.bgcolor.hex"
        :class="[module.structure.columns.length > 1 ? 'st-wrapper-content' : '']"
    >
      <table width="100%" cellspacing="0" cellpadding="0">
        <!--2 COLUMNS -->
        <tr v-if="module.structure.columns.length > 1">
          <td width="100%">

            <comment :content="msoStartingComment"></comment>

            <table class="st-col"
                   align="left"
                   v-for="(column, columnId) in module.structure.columns"
                   :width="column.attribute && column.attribute.width ? column.attribute.width : 100/module.structure.columns.length + '%'"
                   :style="column.style"
            >
                <tr v-for="(component, componentId) in column.components">
                  <td width="100%" 
                      :style="'padding-top:'+ column.style.paddingTop +';padding-left:'+ column.style.paddingLeft +';padding-bottom:'+ column.style.paddingBottom +';padding-right:'+ column.style.paddingRight +';'"
                      :bgcolor="column.attribute.bgcolor.hex" 
                      :valign="column.attribute.valign"
                      :align="component.attribute.align || 'center'"
                  >
                    <component :is="component.type"
                               :component="component"
                               :module-id="moduleId"
                               :column-id="columnId"
                               :component-id="componentId"></component>
                  </td>
                </tr>
            </table>

            <comment :content="msoEndingComment"></comment>

          </td>
        </tr>
        <!--2 COLUMNS -->
        <!--1 COLUMN -->
        <tr v-else v-for="(component, componentId) in module.structure.columns[0].components">
          <td :valign="component.attribute.valign"
              :align="component.attribute.align || 'left'"
              :style="module.structure.style"
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
        return "[if lte mso 7]>" +
          "<table width='" + this.templateWidth + "' cellpading='0' cellspacing='0' border='0' style='border-collapse: collapse; table-width: fixed;' align='center'>" +
          "<tr>" +
          "<td style='width: " + this.templateWidth + "px !important'>" +
          "<![endif]";
      },
      msoEndingComment() {
        return "[if lte mso 7]>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "<![endif]";
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
      ModuleToolbar,
    }
  };
</script>
