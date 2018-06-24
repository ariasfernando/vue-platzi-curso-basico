<template>
  <tr v-if="module.type === 'custom'"
      class="stx-module-wrapper"
      :class="[`stx-${module.name}`, module.isFixed ? 'stx-fixed' : '', {'stx-module-wrapper-active': activeModule === moduleId }]"
      @mouseover="setModulesMouseOver"
      @mouseleave="setModulesMouseLeave"
  >
    <td class="stx-toolbar-content stx-position-relative"
        :data-module-id="moduleId"
        :class="{ 'stx-show-error': module.data.errors && module.data.errors.length }"
        @click.prevent="config"
    >
      <component :is="'custom-' + module.key" :module="module" :module-id="moduleId"></component>
      <module-toolbar :module-id="moduleId" v-if="!module.data.hideToolbar"></module-toolbar>
      <div class="st-remove-element module-overlay"></div>
      <div class="st-remove-element default-module-error"></div>
    </td>
  </tr>

  <tr
    v-else
    class="stx-module-wrapper"
    :class="[`stx-${module.key}`, {'stx-module-wrapper-active': activeModule === moduleId }]"
    @mouseover="setModulesMouseOver"
    @mouseleave="setModulesMouseLeave"
  >
    <td 
      class="stx-toolbar-content stx-position-relative"
      :data-module-id="moduleId"
      :style="module.structure.style"
      :valign="module.structure.attribute.valign || 'top'"
      :bgcolor="module.structure.attribute.bgcolor"
      :class=" { 'stx-show-error': showError(moduleId), 'st-wrapper-content': module.structure.columns.length > 1 ,[module.structure.attribute.classes]:module.structure.attribute.classes}"
    >

      <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="st-wrapper" 
        align="center"
        :class="{ 'stx-wrapper': module.structure.columns.length === 1 }"
      >
        <!--2 COLUMNS -->
        <tr v-if="module.structure.columns.length > 1">

          <!--2 COLUMNS STACKING -->
          <td
            width="100%"
            v-if="module.structure.columnsStacking === 'normal'"
            :valign="module.structure.attribute.valign || 'top'"
          >
            <comment :content="msoStartingComment"></comment>
            <columns-stacked-render v-for="(column, columnId) in module.structure.columns" :key="columnId" :module-id="moduleId" :column="column" :column-id="columnId"></columns-stacked-render>
          </td>

          <!--2 COLUMNS INVERTED STACKING ONLY FOR 2 COLUMNS-->
          <td
            width="100%"
            v-else-if="module.structure.columnsStacking === 'invertedStacking'"
            :valign="module.structure.attribute.valign || 'top'"
          >
            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              dir="rtl"
              >
              <tr>
                <td width="100%" :valign="module.structure.attribute.valign || 'top'">
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
          <td
            v-else-if="module.structure.columnsStacking == 'columnsFixed'"
            v-for="(column, columnId) in module.structure.columns"
            :width="column.container.attribute && column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%'"
            :valign="column.container.attribute.valign || 'top'"
            :key="column.id"
          >
            <columns-fixed-render
              :column="column"
              :column-id="columnId"
              :module-id="moduleId"
            ></columns-fixed-render>
          </td>
        </tr>
        <!--2 COLUMNS -->

        <!--1 COLUMN -->
        <tr
          v-else
          v-for="(component, componentId) in module.structure.columns[0].components"
          @click.prevent="setComponent(moduleId, 0, componentId)"
          :key="component.id"
        >
          <td width="100%" class="st-mobile-full-width" style="vertical-align: top; width: 100%;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
              <template>
                  <component
                    :is="component.type"
                    :component="component"
                    :module-id="moduleId"
                    :column-id="0"
                    :component-id="componentId"
                  ></component>
                </template>
              </table>
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
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import ColumnsStackedRender from './partials/ColumnsStackedRender.vue';
  import ColumnsFixedRender from './partials/ColumnsFixedRender.vue';
  import ColumnsInvertedStackingRender from './partials/ColumnsInvertedStackingRender.vue';
  import ComponentAttributeMixin from '../common/mixins/ComponentAttributeMixin.js';
  import _ from 'lodash';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    mixins: [ ComponentAttributeMixin ],
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
        return `
        [if gte mso 9]>
          <table width="${this.templateWidth}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center">
            <tr>
              <td width="${this.calculeWidthColumnPx(0)}" style="width:${this.calculeWidthColumnPx(0)}px !important">
              <![endif]`;
      },
      msoStartingCommentInverted() {
        return `
        [if gte mso 9]>
          <table width="${this.columnWidthPadding}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center" dir="rtl">
            <tr>
              <td style="width: ${this.calculeWidthColumnPx(0)}px !important" dir="ltr">
              <![endif]`;
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
      columnWidthPadding(){
        return this.templateWidth - _.parseInt(this.module.structure.style.paddingLeft || 0) - _.parseInt(this.module.structure.style.paddingRight || 0);
      }
    },
    methods: {

      calculeWidthColumnPx(columnId){
        let width = this.module.structure.columns[columnId].container.attribute.width;
        if(_.endsWith(width, "%")){
          return this.templateWidthWithoutPadding / 100 * _.parseInt(width);
        }
        return width;
      },
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
      ModuleToolbar,
      ColumnsStackedRender,
      ColumnsFixedRender,
      ColumnsInvertedStackingRender,
    }
  };
</script>
