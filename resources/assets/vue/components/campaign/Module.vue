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
        :width="_.get(this.module,'structure.attribute.width','10%')"
        :style="_.get(this.module,'structure.style')"
        :valign="_.get(this.module,'structure.attribute.valign','top')"
        :bgcolor="_.get(this.module,'structure.attribute.bgcolor')">
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
    @mouseleave="setModulesMouseLeave">
    <td
      class="stx-toolbar-content stx-position-relative"
      :data-module-id="moduleId"
      :background="modulebackgroundImage"
      :width="module.structure.attribute.width || '100%'"
      :height="module.structure.attribute.height"
      :style="styleModule"
      :valign="module.structure.attribute.valign || 'top'"
      :bgcolor="module.structure.attribute.bgcolor"
      :class=" { 'stx-show-error': hasErrors, 'st-wrapper-content': module.structure.columns.length > 1 ,[module.structure.attribute.classes]:module.structure.attribute.classes}">
      <background-image :element="module.structure" :key='modulebackgroundImage'>
        <template :slot="modulebackgroundImage ? 'with-background-image': 'without-background-image' ">
          <column-manager
            :module-id="moduleId">
            <template slot-scope="{columnData}">
              <component
                v-for="(component, componentId) in columnData.column.components"
                :key="component.id"
                @select-component="selectComponent"
                :is="component.type"
                :component="component"
                :module-id="moduleId"
                :column-id="columnData.columnId"
                :component-id="componentId">
              </component>
            </template>
          </column-manager>
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
  import DividerElement from './elements/DividerElement.vue';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import ImageElement from './elements/ImageElement.vue';
  import ColumnManager from './partials/ColumnManager.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import TextElement from './elements/TextElement.vue';
  import validatorMixin from '../../plugins/modules/mixins/validator.js';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    mixins: [ ElementMixin, validatorMixin ],
    components: {
      BackgroundImage,
      ButtonElement,
      DividerElement,
      ImageElement,
      ColumnManager,
      ModuleToolbar,
      TextElement,
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
       _(){
           return _;
      },
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      moduleErrors() {
        return this.module.data.errors || [];
      },
      activeModule() {
        return this.$store.getters["campaign/activeModule"];
      },
      hasErrors() {
        return this.module.data && this.module.data.errors && this.module.data.errors.length;
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
