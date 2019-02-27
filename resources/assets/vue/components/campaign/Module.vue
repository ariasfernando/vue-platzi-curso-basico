<template>
  <tr v-if="module.type === 'custom'"
      class="stx-module-wrapper"
      :class="[`stx-${module.name}`, { 'stx-fixed': module.isFixed, 'stx-module-wrapper-active': currentModuleIdInstance === module.idInstance }]"
      @mouseover="setModulesMouseOver"
      @mouseleave="setModulesMouseLeave"
  >
    <td
      class="stx-toolbar-content stx-position-relative"
      :data-module-id="moduleId"
      :module-id-instance="module.idInstance"
      :class="{ 'stx-show-error': hasErrors }"
      :width="_.get(this.module,'structure.attribute.width','100%')"
      :style="_.get(this.module,'structure.style')"
      :valign="_.get(this.module,'structure.attribute.valign','top')"
      :bgcolor="_.get(this.module,'structure.attribute.bgcolor')"
      @mousedown="onClickModule">
      <component :is="'custom-' + module.key" :module="module" :module-id="moduleId"></component>
      <module-toolbar :module-id="moduleId" v-if="!module.data.hideToolbar"></module-toolbar>
      <div class="st-remove-element module-overlay"></div>
      <div class="st-remove-element default-module-error"></div>
    </td>
  </tr>

  <tr
    v-else
    class="stx-module-wrapper"
    :class="[`stx-${module.key}`, { 'stx-fixed': module.isFixed, 'stx-module-wrapper-active': currentModuleIdInstance === module.idInstance }]"
    @mouseover="setModulesMouseOver"
    @mouseleave="setModulesMouseLeave">
    <td
      class="stx-toolbar-content stx-position-relative st-wrapper-content"
      :data-module-id="moduleId"
      :module-id-instance="module.idInstance"
      :background="modulebackgroundImage"
      :width="module.structure.attribute.width || '100%'"
      :height="module.structure.attribute.height"
      :style="styleModule"
      :valign="module.structure.attribute.valign || 'top'"
      :bgcolor="module.structure.attribute.bgcolor"
      :class=" { 'stx-show-error': hasErrors, [module.structure.attribute.classes]:module.structure.attribute.classes}"
      @mousedown="onClickModule">
      <background-image :element="module.structure" :key='modulebackgroundImage' :width="templateInnerWidth">
        <template :slot="modulebackgroundImage ? 'with-background-image': 'without-background-image' ">
          <RowContainer
            v-for="(row, rowIndex) in module.structure.rows"
            :key="rowIndex"
            :module="module"
            :element="row"
            :row="row"
            :with-row="module.structure.rows.length > 1">
            <column-manager :module-id="moduleId" :module="module" :row="row">
              <template slot-scope="{columnData}">
                <component
                  :is="component.key || component.type"
                  v-for="(component, componentIndex) in columnData.column.components"
                  :key="component.id"
                  :component="component"
                  :module-id="moduleId"
                  :module="module"
                  :element="component"
                  :column-id="columnData.columnId"
                  :component-id="componentIndex"
                  :row="row"
                  @select-component="selectComponent" />
              </template>
            </column-manager>
          </RowContainer>
        </template>
      </background-image>
      <module-toolbar :module-id="moduleId" />
      <div class="st-remove-element module-overlay" />
      <div class="st-remove-element default-module-error" style="display:none" />
    </td>
  </tr>
</template>

<script>

  import BackgroundImage from '../common/BackgroundImage';
  import ButtonElement from './elements/ButtonElement.vue';
  import ColumnManager from '../common/containers/ColumnManager.vue';
  import CustomCodeElement from './elements/CustomCodeElement.vue';
  import DividerElement from './elements/DividerElement.vue';
  import ElementMixin from '../common/mixins/ElementMixin.js';
  import ImageElement from './elements/ImageElement.vue';
  import ModuleToolbar from './partials/ModuleToolbar.vue';
  import RowContainer from '../common/containers/RowContainer.vue';
  import TextElement from './elements/TextElement.vue';
  import validatorMixin from '../../plugins/modules/mixins/validatorMixin.js';

  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    mixins: [ ElementMixin, validatorMixin ],
    components: {
      BackgroundImage,
      ButtonElement,
      ColumnManager,
      CustomCodeElement,
      DividerElement,
      ImageElement,
      ModuleToolbar,
      RowContainer,
      TextElement,
    },
    created() {
      if (this.module.type === 'custom') {
        this.$store.commit('campaign/clearErrorsByModuleId', this.moduleId);
        this.registerCustomModuleDefaultValidationErrors(this.moduleId);
      }
    },
    computed: {
      moduleErrors() {
        return this.module.data.errors || [];
      },
      currentModuleIdInstance() {
        return this.$store.getters["campaign/currentModuleIdInstance"];
      },
      hasErrors() {
        return this.module.data && this.module.data.errors && this.module.data.errors.length;
      },
      modulebackgroundImage(){
        return this.module.structure.style.backgroundImage ? this.$_app.config.imageUrl + this.module.structure.style.backgroundImage : undefined;
      },
      styleModule(){
        let styleModule = {}
        if (this.modulebackgroundImage) {
          styleModule = this.elementBorderHorizontalPaddingAndHeight(this.module.structure)
          styleModule = _.merge(styleModule, this.elementBackground(this.module.structure));
        } else {
         styleModule = this.elementBorderPaddingAndHeight(this.module.structure);
        }
        return styleModule;
      }
    },
    methods: {
      onClickModule() {
        this.$store.commit("campaign/unsetCurrentElement");
        this.$store.commit('campaign/setCurrentModuleIdInstance', this.module.idInstance);
        this.$store.commit('campaign/setShowModuleSettings', true);
      },
      selectComponent(elementId) {
        this.$store.commit("campaign/setCurrentElementId", elementId);
        this.$store.commit('campaign/setCurrentModuleIdInstance', this.module.idInstance);
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
