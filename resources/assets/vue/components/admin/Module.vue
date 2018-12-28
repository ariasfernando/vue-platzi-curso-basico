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
</style>
<style lang="scss">
[data-column-id] {
  position: relative;
}
@import '../../stensul-ui/scss/stui.scss';
.alignRight {
  float: left;
}

.st-content-component {
  outline: 1px dashed $color-secondary;
  border: none !important;
}

.module-wrapper {
  li.ghost-component-menu {
    outline: 2px dashed $color-secondary;
    color: $color-secondary;
    background-color: lighten($color-secondary, 30%);
    height: 80px;
    line-height: 80px;
    width: 100%;
    display: table-row;
    list-style-type: none;
    font-size: 13px;
    z-index: 300;
    text-align: center;
    opacity: 1 !important;
    vertical-align: middle;
    position: relative;
    &:before {
      content: 'Drag content here';
    }
    i {
      display: none;
    }
    p {
      display: none;
    }
    & ~ tr .empty-column {
      opacity: 0;
    }
  }
  tr.ghost-component {
    color: $color-secondary;
    background-color: lighten($color-secondary, 30%);
    text-align: center;
    height: 20px;
    line-height: 20px;
    &:before {
      content: 'Drag content here';
      display: flex;
      justify-content: center;
      border: none;
      color: $color-secondary;
      background-color: lighten($color-secondary, 30%);
      height: 80px;
      line-height: 80px;
      font-family: 'Open Sans', Arial, serif;
      opacity: 1;
      outline: 2px dashed $color-secondary;
      outline-offset: -10px;
    }
    td {
      display: none;
    }
  }
}
.stx-wrapper {
  display: contents;
  width: 100%;
}
</style>
