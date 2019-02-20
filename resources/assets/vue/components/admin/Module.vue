<template>
  <table
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    align="center"
    style="width:100%; position: relative;">
    <tr>
      <td
        :background="modulebackgroundImage"
        :width="module.structure.attribute.width || '100%'"
        :height="module.structure.attribute.height"
        :style="[elementBorderPaddingAndHeight(module.structure),{position: 'relative'}]"
        :valign="module.structure.attribute.valign || 'top'"
        :bgcolor="module.structure.attribute.bgcolor"
        class="st-content-component"
        :class="{[module.structure.attribute.classes]:module.structure.attribute.classes}">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="width: 100%;"
          class="stx-position-relative">
          <RowContainer
            v-for="(row, rowIndex) in module.structure.rows"
            :key="rowIndex"
            :module="module"
            :element="row"
            :row="row"
            :with-row="module.structure.rows.length > 1"
            @select-component="selectComponent">
              <ColumnManager :row="row">
                <template slot-scope="{columnData}">
                  <ColumnDraggable
                    :row="row"
                    :row-index="rowIndex"
                    :module="module"
                    :column-id="columnData.columnId"
                    :column="columnData.column"
                    @select-component="selectComponent">
                    <Component
                      :is="component.type"
                      v-for="(component, componentId) in columnData.column.components"
                      :key="component.id"
                      :row="row"
                      class="st-component"
                      :component="component"
                      :element="component"
                      :column-id="columnData.columnId"
                      :is-active="currentElementId === component.id"
                      :component-id="componentId"
                      @select-component="selectComponent" />
                  </ColumnDraggable>
                </template>
              </ColumnManager>
          </RowContainer>
        </table>
      </td>
    </tr>
    <HighlightOfElement
      v-if="isStudio"
      class="highlight-row"
      :active="isActiveGeneralSettings" />
    <ElementSelector
      v-if="isStudio"
      :left-position="templateWidth/2"
      :bottom="-70"
      label="Module"
      :active="isActiveGeneralSettings"
      selector-icon="fa fa-cog"
      @element-selected="moduleSelect" />
  </table>
</template>

<script>
import BackgroundImage from '../common/BackgroundImage.vue';
import ButtonElement from './elements/ButtonElement.vue';
import ColumnManager from '../common/containers/ColumnManager.vue';
import RowContainer from '../common/containers/RowContainer.vue';
import CustomCodeElement from './elements/CustomCodeElement.vue';
import DividerElement from './elements/DividerElement.vue';
import ElementMixin from '../common/mixins/ElementMixin';
import ElementSelector from '../common/ElementSelector.vue';
import HighlightOfElement from '../common/HighlightOfElement.vue';
import ImageElement from './elements/ImageElement.vue';
import ColumnDraggable from './ColumnDraggable.vue';
import TextElement from './elements/TextElement.vue';
import ModuleHeight from './mixins/ModuleHeight';

module.exports = {
  name: 'Module',
  mixins: [ElementMixin, ModuleHeight],
  components: {
    BackgroundImage,
    ButtonElement,
    ColumnDraggable,
    ColumnManager,
    CustomCodeElement,
    DividerElement,
    ElementSelector,
    HighlightOfElement,
    ImageElement,
    RowContainer,
    TextElement,
  },
  computed: {
    isActiveGeneralSettings() {
      return this.currentElementId === false;
    },
    modulebackgroundImage() {
      return this.module.structure.style.backgroundImage
        ? this.$_app.config.imageUrl +
            this.module.structure.style.backgroundImage
        : undefined;
    },
  },
  methods: {
    selectComponent(ref) {
      this.$store.commit('module/setCurrentElementId', ref);
    },
    moduleSelect() {
      this.selectComponent(false);
    },
  },
  mounted() {
    this.setModuleHeight();
  },
  watch: {
    module: {
      handler() {
        this.$nextTick(() => {
          this.setModuleHeight();
        });
      },
      deep: true,
    },
    draggableChanged() {
      this.$nextTick(() => {
        this.setModuleHeight();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../stensul-ui/scss/stui.scss';
.highlight-row {
  top: 0px;
  left: -40px;
  bottom: -50px;
  right: -40px;
  outline-style: solid;
  outline-color: $stui-color-grey;
  outline-width: 2px;
  z-index:1 !important;
}
.st-content-component /deep/ {
  outline: 1px dashed $stui-color-secondary;
  [data-column-id] {
    position: relative;
  }
  .stx-wrapper {
    display: contents;
    width: 100%;
  }
}
</style>
