<template>
  <tr v-if="module.type === 'custom'"
      class="stx-module-wrapper"
      :class="[`stx-${module.name}`, { 'stx-fixed': module.isFixed, 'stx-module-wrapper-active': activeModule === moduleId }]"
      @mouseover="setModulesMouseOver"
      @mouseleave="setModulesMouseLeave"
  >
    <td class="stx-toolbar-content stx-position-relative"
        :data-module-id="moduleId"
        :class="{ 'stx-show-error': hasErrors }"
        @click.prevent="config"
        :width="moduleWidth"
        :style="moduleStyle"
        :valign="moduleValign"
        :bgcolor="moduleBgcolor"
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
    :class="[`stx-${module.key}`, { 'stx-fixed': module.isFixed, 'stx-module-wrapper-active': activeModule === moduleId }]"
    @mouseover="setModulesMouseOver"
    @mouseleave="setModulesMouseLeave"
  >
    <td
      class="stx-toolbar-content stx-position-relative"
      :data-module-id="moduleId"
      :background="modulebackgroundImage"
      :width="module.structure.attribute.width || '100%'"
      :height="module.structure.attribute.height"
      :style="styleModule"
      :valign="module.structure.attribute.valign || 'top'"
      :bgcolor="module.structure.attribute.bgcolor"
      :class=" { 'stx-show-error': hasErrors, 'st-wrapper-content': module.structure.columns.length > 1 ,[module.structure.attribute.classes]:module.structure.attribute.classes}"
    >

      <background-image :element="module.structure" :key='modulebackgroundImage' :width="templateWidth">
        <template :slot="modulebackgroundImage ? 'with-background-image': 'without-background-image' ">
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
              :data-column-id="columnId"
              v-else-if="module.structure.columnsStacking == 'columnsFixed'"
              v-for="(column, columnId) in module.structure.columns"
              :width="column.container.attribute && column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%'"
              :valign="column.container.attribute.valign || 'top'"
              :class="column.container.attribute.classes"
              :height="column.container.attribute.height"
              :bgcolor="column.container.attribute.bgcolor"
              :key="column.id"
              :style="[elementBorderAndPadding(column.container),{'height': column.container.attribute.height + 'px'}, {'width': widthStyle(column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%')}]"
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
                      context="campaign"
                    ></component>
                  </template>
                </table>
            </td>
          </tr>
          <!--1 COLUMN -->
        </template>
      </background-image>
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
  import validatorMixin from '../../plugins/modules/mixins/validator.js';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import BackgroundImage from '../common/BackgroundImage';
  import _ from 'lodash';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    mixins: [ ElementMixin, validatorMixin ],
    created() {
      if(this.module.type === 'studio'
          && ((this.module.structure && this.module.structure.columns && this.module.structure.columns.length > 1)
              || (this.module.structure && this.module.structure.columns && this.module.structure.columns.length === 1
                  && this.module.structure.columns[0].components.length > 1)
            )
        ) {
          // studio modules with multiple columns or multiple elements which have plugins with validation do not trigger when the module is added
          // so we need to check a flag to aid the user to open each module and run the validations at least once
        this.registerStudioModuleDefaultValidationErrors(this.moduleId);
      }
      else if(this.module.type === 'custom') {
        this.$store.commit('campaign/clearErrorsByModuleId', this.moduleId);
        this.registerCustomModuleDefaultValidationErrors(this.moduleId);
        }
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      templateWidth() {
        return this.$store.getters["campaign/campaign"].library_config.templateWidth;
      },
      moduleErrors() {
        return this.module.data.errors || [];
      },
      msoStartingComment() {
        return `[if gte mso 9]>
          <table width="${this.templateWidth}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center">
            <tr>
              <td width="${this.calculeWidthColumnPx(0)}" style="width:${this.calculeWidthColumnPx(0)}px !important" valign="top">
              <![endif]`;
      },
      msoStartingCommentInverted() {
        return `[if gte mso 9]>
          <table width="${this.columnWidthPadding}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center" dir="rtl">
            <tr>
              <td style="width: ${this.calculeWidthColumnPx(0)}px !important" dir="ltr" valign="top">
              <![endif]`;
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
      columnWidthPadding(){
        return this.templateWidth - _.parseInt(this.module.structure.style.paddingLeft || 0) - _.parseInt(this.module.structure.style.paddingRight || 0);
      },
      hasErrors() {
        return this.module.data && this.module.data.errors && this.module.data.errors.length;
      },
      moduleWidth(){
        return _.get(this.module,'structure.attribute.width','100%');
      },
      moduleStyle(){
        return _.get(this.module,'structure.style');
      },
      moduleValign(){
        return _.get(this.module,'structure.attribute.valign','top');
      },
      moduleBgcolor(){
        return _.get(this.module,'structure.attribute.bgcolor');
      },
      modulebackgroundImage(){
        return this.module.structure.style.backgroundImage ? this.$_app.config.imageUrl + this.module.structure.style.backgroundImage : undefined;
      },
      styleModule(){
        let styleModule = {}
        if (this.modulebackgroundImage) {
          styleModule = this.elementBorderHorizontalPaddingAndHeight(this.module.structure)
          styleModule= [...styleModule, this.elementBackground(this.module.structure)]
        } else {
         styleModule = this.elementBorderPaddingAndHeight(this.module.structure);
        }
        return styleModule;
      }
    },
    methods: {

      elementBorderAndPadding(element) {
        const BorderAndPadding = {};

        _.each(element.style, (value, key) => {
          if (key.indexOf('padding') >= 0 || key.indexOf('border') >= 0) {
            BorderAndPadding[key] = value;
          }
        });
        return BorderAndPadding;
      },
      calculeWidthColumnPx(columnId){
        let width = this.module.structure.columns[columnId].container.attribute.width;
        if(_.endsWith(width, "%")){
          return this.templateWidthWithoutPadding / 100 * _.parseInt(width);
        }
        return width;
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
      },
      widthStyle(width) {
        return _.endsWith(width, "%") ? width : width + "px";
      },
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
      BackgroundImage
    }
  };
</script>
