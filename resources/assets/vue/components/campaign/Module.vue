<template>
  <tr v-if="module.type === 'custom'"
      class="stx-module-wrapper"
      :class="{ 'stx-module-wrapper-active': activeModule === moduleId }"
      @mouseover="setModulesMouseOver"
      @mouseleave="setModulesMouseLeave"
  >
    <td class="stx-toolbar-content stx-position-relative"
        :data-module-id="moduleId"
        :class="{ 'stx-show-error': module.data.errors && module.data.errors.length }"
        @click.prevent="config"
    >
      <component :is="'custom-' + module.name" :module="module" :module-id="moduleId"></component>
      <module-toolbar :module-id="moduleId"></module-toolbar>
      <div class="st-remove-element module-overlay"></div>
      <div class="st-remove-element default-module-error"></div>
    </td>
  </tr>

  <tr v-else
      class="stx-module-wrapper"
      :class="{ 'stx-module-wrapper-active': activeModule === moduleId }"
      @mouseover="setModulesMouseOver"
      @mouseleave="setModulesMouseLeave"
  >
    <td class="stx-toolbar-content stx-position-relative"
        :data-module-id="moduleId"
        :style="module.structure.style"
        :bgcolor="module.structure.attribute.bgcolor"
        :class=" { 'stx-show-error': showError(moduleId), 'st-wrapper-content': module.structure.columns.length > 1 }">
      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        :class="{ 'stx-wrapper': module.structure.columns.length === 1 }"
        >
        <!--2 COLUMNS -->
        <tr v-if="module.structure.columns.length > 1">

          <!--2 COLUMNS STACKING -->
          <td width="100%" v-if="!module.structure.columnsFixed && !module.structure.invertedStacking">
            <comment :content="msoStartingComment"></comment>
            <columns-stacked-render v-for="(column, columnId) in module.structure.columns" :key="columnId" :module-id="moduleId" :column="column" :column-id="columnId"></columns-stacked-render>
          </td>

          <!--2 COLUMNS INVERTED STACKING ONLY FOR 2 COLUMNS-->
          <td width="100%" v-else-if="!module.structure.columnsFixed && module.structure.invertedStacking">
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              dir="rtl"
              >
              <tr>
                <td width="100%">
                  <comment :content="msoStartingCommentInverted"></comment>

                  <columns-inverted-stacking-render
                    :module-id="moduleId"
                    :column="module.structure.columns[1]"
                    :column-id="1"
                    :column-width-padding="columnWidthPadding"
                    >
                  </columns-inverted-stacking-render>
                  <columns-inverted-stacking-render
                    :module-id="moduleId"
                    :column="module.structure.columns[0]"
                    :column-id="0"
                    :column-width-padding="columnWidthPadding"
                    >
                  </columns-inverted-stacking-render>

                </td>
              </tr>
            </table>
          </td>

          <!--2 COLUMNS FIXED -->
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
        <tr v-else
          v-for="(component, componentId) in module.structure.columns[0].components"
          @click.prevent="setComponent(moduleId, 0, componentId)"
          :class="component.attribute.hideElement ? 'stx-hide-element st-remove-element' : '' "
        >
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
      <div class="st-remove-element default-module-error" style="display:none"></div>
    </td>
  </tr>
</template>

<script>

  import TextElement from './elements/TextElement.vue';
  import ButtonElement from './elements/ButtonElement.vue';
  import ImageElement from './elements/ImageElement.vue';
  import DividerElement from './elements/DividerElement.vue';
  import SeparatorElement from './elements/SeparatorElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import ColumnsStackedRender from './partials/ColumnsStackedRender.vue';
  import ColumnsFixedRender from './partials/ColumnsFixedRender.vue';
  import ColumnsInvertedStackingRender from './partials/ColumnsInvertedStackingRender.vue';
  import { mixin as clickaway } from 'vue-clickaway';
  import _ from 'lodash';

  module.exports = {
    name: 'Module',
    mixins: [
      clickaway
    ],
    props: ['moduleId'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      templateWidth() {
        return this.$store.getters["campaign/campaign"].library_config.templateWidth;
      },
      moduleErrors() {
        return this.$store.getters["campaign/moduleErrors"];
      },
      fieldErrors() {
        return this.$store.getters["campaign/fieldErrors"];
      },
      msoStartingComment() {
        return "[if gte mso 9]>" +
          "<table width='" + this.templateWidth + "' cellpading='0' cellspacing='0' border='0' style='border-collapse: collapse; table-width: fixed;' align='center'>" +
          "<tr>" +
          "<td style='width: " + this.templateWidth / this.module.structure.columns.length + "px !important'>" +
          "<![endif]";
      },
      msoStartingCommentInverted() {
        return "[if gte mso 9]>" +
          "<table width='" + this.columnWidthPadding + "' cellpading='0' cellspacing='0' border='0' style='border-collapse: collapse; table-width: fixed;' align='center' dir='rtl'>" +
          "<tr>" +
          "<td style='width: " + this.columnWidthPadding / this.module.structure.columns.length + "px !important' dir='ltr'>" +
          "<![endif]";
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
      columnWidthPadding(){
        return this.templateWidth - (_.parseInt(this.module.structure.style.paddingLeft) + _.parseInt(this.module.structure.style.paddingRight));
      }
    },
    methods: {
      showError(moduleId){
        let err = false;
        _.each(this.moduleErrors, (error, key) => {
           if (!_.isUndefined(error.scope.moduleId)){
              if (error.scope.moduleId === moduleId){
                err = true;
              }
           }
        });

        return err;
      },
      config() {
        this.$store.commit("campaign/setCustomModule", this.moduleId);
        this.$store.commit("campaign/unsetCurrentModule");
      },
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
      getModuleRow( event ){
        let $row = null;

        if( $(event.target).hasClass('stx-module-wrapper') ){
          $row = $(event.target);
        }else{
          $row = $(event.target).closest('.stx-module-wrapper');
        };

        if (!$row){
          return false
        };

        return $row;
      },
      setModulesMouseOver(e){
        let $row = this.getModuleRow(e);

        // Highlight module
        if (!$row.find("#moduleHighlight").length && $row.height() < 5) {
          const $hoverTable = $('<table id="moduleHighlight"><tr><td></td></tr></table>');

          $hoverTable.css({
            width: Application.globals.emailWidth,
            height: $row.height()
          });

          $row.find("> td")
            .append($hoverTable);

          $row.find("#moduleHighlight").animate({
            top: "-10px",
            left: "-10px",
            borderWidth: "10px",
            width: "100%"

          }, 50);
        }

      },
      setModulesMouseLeave(e){
        let $row = this.getModuleRow(e);

        // Remove module highlight element
        $row.find("#moduleHighlight").remove();
            }
    },
    components: {
      TextElement,
      ButtonElement,
      ImageElement,
      DividerElement,
      SeparatorElement,
      ModuleToolbar,
      ColumnsStackedRender,
      ColumnsFixedRender,
      ColumnsInvertedStackingRender,
    }
  };
</script>
