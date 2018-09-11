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

      <background-image :element="module.structure" :key='modulebackgroundImage'>
        <template :slot="modulebackgroundImage ? 'with-background-image': 'without-background-image' ">
          <!-- MORE THAN 1 COLUMN -->
          <tr v-if="module.structure.columns.length > 1">
            <!-- COLUMNS STACKING -->
            <td
              width="100%"
              style="width:100%;"
              v-if="module.structure.columnsStacking === 'normal' || isInvertedStacking"
              :valign="module.structure.attribute.valign || 'top'"
              >
              <wrapper-comment
                :start="msoStartingComment"
                :end="msoEndingComment">
                <template v-for="(column, columnId) in columnsSort" >
                  <column-render
                    :key="'column-' + columnId"
                    :module-id="moduleId"
                    :column="column"
                    :column-id="columnId"
                    :is-inverted="isInvertedStacking">
                    <component
                      v-for="(component, componentId) in column.components"
                      :key="component.id"
                      @select-component="selectComponent"
                      :is="component.type"
                      :component="component"
                      :module-id="moduleId"
                      :column-id="columnId"
                      :component-id="componentId">
                    </component>
                  </column-render>
                  <line-comment
                    v-if="columnsSort.length -1 > columnId"
                    :key="'comment-' + columnId"
                    :comment="msoBetweenComment(columnId)"></line-comment>
                </template>
              </wrapper-comment>
            </td>
            <!-- COLUMNS FIXED -->
            <td
              v-else-if="module.structure.columnsStacking == 'columnsFixed'"
              v-for="(column, columnId) in module.structure.columns"
              :key="column.id"
              :data-column-id="columnId"
              :width="columnWidth(columnId)"
              :valign="column.container.attribute.valign || 'top'"
              :class="column.container.attribute.classes"
              :height="column.container.attribute.height"
              :bgcolor="column.container.attribute.bgcolor"
              :style="[elementBorderPaddingAndHeight(column.container), {'width': widthStyle(columnWidth(columnId))}]"
            >
              <table align="left" width="100%" cellspacing="0" cellpadding="0" border="0">
                <component
                  v-for="(component, componentId) in column.components"
                  :key="component.id"
                  @select-component="selectComponent"
                  :is="component.type"
                  :component="component"
                  :module-id="moduleId"
                  :column-id="columnId"
                  :component-id="componentId">
                </component>
              </table>
            </td>
          </tr>
          <!--2 COLUMNS -->

          <!--1 COLUMN -->
          <component
            v-else
            v-for="(component, componentId) in module.structure.columns[0].components"
            :key="component.id"
            :is="component.type"
            :component="component"
            :module-id="moduleId"
            :column-id="0"
            :component-id="componentId"
            @select-component="selectComponent"
          ></component>
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

  import _ from 'lodash';
  import BackgroundImage from '../common/BackgroundImage';
  import ButtonElement from './elements/ButtonElement.vue';
  import ColumnRender from './partials/ColumnRender.vue';
  import DividerElement from './elements/DividerElement.vue';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import ImageElement from './elements/ImageElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import TextElement from './elements/TextElement.vue';
  import validatorMixin from '../../plugins/modules/mixins/validator.js';
  import WrapperComment from '../common/comments/WrapperComment';
  import LineComment from '../common/comments/LineComment';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    mixins: [ ElementMixin, validatorMixin ],
    components: {
      BackgroundImage,
      ButtonElement,
      ColumnRender,
      DividerElement,
      ImageElement,
      LineComment,
      ModuleToolbar,
      TextElement,
      WrapperComment
    },
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
      moduleErrors() {
        return this.module.data.errors || [];
      },
      msoStartingComment() {
        return `<!--[if gte mso 9]>
          <table width="${this.templateInnerWidth}" style="width:${this.widthStyle(this.templateInnerWidth)}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center" ${this.isInvertedStacking ? 'dir="rtl"' : ''}>
            <tr>
              <td width="${this.columnWidth(0)}" ${this.columnBgcolor(0)} style="width:${this.widthStyle(this.columnWidth(0))}" ${this.isInvertedStacking ? 'dir="ltr"' : ''} valign="top">
              <![endif]-->`;
      },
      msoEndingComment() {
        return `<!--[if gte mso 9]>
              </td>
            </tr>
          </table>
        <![endif]-->`;
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
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
      isInvertedStacking(){
        return this.module.structure.columnsStacking === 'invertedStacking';
      },
      columnsSort(){
        return this.isInvertedStacking ? this.module.structure.columns.reverse() : this.module.structure.columns;
      },
      modulebackgroundImage(){
        return this.module.structure.style.backgroundImage ? this.$_app.config.imageUrl + this.module.structure.style.backgroundImage : undefined;
      },
      styleModule(){
        return this.modulebackgroundImage ?
          this.elementBorderHorizontalPaddingAndHeight(this.module.structure) :
          this.elementBorderPaddingAndHeight(this.module.structure);
      }
    },
    methods: {
      msoBetweenComment(columnId) {
        return `<!--[if gte mso 9]>
              </td>
              <td width="${this.columnWidth(columnId + 1)}" ${this.columnBgcolor(columnId+1)} style="width: ${this.widthStyle(this.columnWidth(columnId +1))}" ${this.isInvertedStacking ? 'dir="ltr"' : ''} align="left" valign="top">
                <![endif]-->`;
      },
      config() {
        this.$store.commit("campaign/setCustomModule", this.moduleId);
        this.$store.commit("campaign/unsetCurrentModule");
      },
      selectComponent(moduleId, columnId, componentId) {
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
    },
  };
</script>
