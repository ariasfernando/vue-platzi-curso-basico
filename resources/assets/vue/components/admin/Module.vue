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
          style="width: 100%;">
          <ColumnManager :module="module">
            <template slot-scope="{columnData}">
              <ColumnDraggable
                :module="module"
                :column-id="columnData.columnId"
                :column="columnData.column"
                :column-area-styles="columnData.columnAreaStyles"
                @select-component="selectComponent">
                <Component
                  :is="component.type"
                  v-for="(component, componentId) in columnData.column.components"
                  :key="component.id"
                  :module="module"
                  class="st-component"
                  :component="component"
                  :module-id="moduleId"
                  :column-id="columnData.columnId"
                  :is-active="currentElement.id === component.id"
                  :component-id="componentId"
                  @select-component="selectComponent" />
              </ColumnDraggable>
            </template>
          </ColumnManager>
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
      label="Row"
      :active="isActiveGeneralSettings"
      selector-icon="fa fa-cog"
      @element-selected="moduleSelect" />
  </table>
</template>

<script>
import BackgroundImage from '../common/BackgroundImage.vue';
import ButtonElement from './elements/ButtonElement.vue';
import ColumnManager from '../common/containers/ColumnManager.vue';
import CustomCodeElement from './elements/CustomCodeElement.vue';
import DividerElement from './elements/DividerElement.vue';
import ElementMixin from '../common/mixins/ElementMixin';
import ElementSelector from '../common/ElementSelector.vue';
import HighlightOfElement from '../common/HighlightOfElement.vue';
import ImageElement from './elements/ImageElement.vue';
import ColumnDraggable from './ColumnDraggable.vue';
import TextElement from './elements/TextElement.vue';

module.exports = {
  name: 'Module',
  mixins: [ElementMixin],
  components: {
    BackgroundImage,
    ButtonElement,
    ColumnManager,
    CustomCodeElement,
    DividerElement,
    ElementSelector,
    HighlightOfElement,
    ImageElement,
    ColumnDraggable,
    TextElement,
  },
  computed: {
    isActiveGeneralSettings() {
      return (
        this.currentComponent.columnId === undefined &&
        this.currentComponent.componentId === undefined
      );
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
      this.$store.commit('module/setCurrentComponent', ref);
    },
    moduleSelect() {
      this.selectComponent({
        columnId: undefined,
        componentId: undefined,
      });
    },
    setModuleHeight() {
      let higherHeight = 0;
      $('.column-draggable.has-component').parents('[column-id]').each((index, item) => {
        higherHeight = Math.max(higherHeight, $(item).height());
      });
      if (this.module.structure.columns.filter(column => column.components.length === 0).length > 0) {
        higherHeight = Math.max(higherHeight, 150);
      }
      this.$store.commit('module/setModuleHeight', higherHeight);
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
  outline-color: $color-grey;
  outline-width: 2px;
}
.st-content-component /deep/ {
  outline: 1px dashed $color-secondary;
  border: none !important;
  [data-column-id] {
    position: relative;
  }
  .stx-wrapper {
    display: contents;
    width: 100%;
  }
}
</style>
