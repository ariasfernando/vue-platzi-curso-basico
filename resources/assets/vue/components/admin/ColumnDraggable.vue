<template>
  <div>
    <Draggable
      :ref="'draggable'"
      v-model="components"
      v-observer:subtree="emitChange"
      style="display: table; width: 100%;"
      element="div"
      :options="options"
      :data-col="columnId"
      :style="getStyles('draggable')"
      class="column-draggable"
      :class="hasComponents ? 'has-component': 'no-component'"
      @start="setDragging(true)"
      @end="setDragging(false)"
      @add="onAdd">
      <slot />
    </Draggable>
    <EmptyColumn
      :key="'EmptyColumn'"
      :ref="'EmptyColumn'"
      :styles="getStyles('EmptyColumn')" />
    <HighlightOfElement
      v-if="isStudio && buildingMode === 'desktop' && !dragging"
      :active="isColumnSelect(columnId)"
      :style="getStyles('HighlightOfElement')" />
    <ElementSelector
      v-if="isStudio && buildingMode === 'desktop' && !dragging && module.structure.columns.length !== 1"
      :key="'selector' + columnId"
      :left-position="columnWidth(columnId) / 2"
      :top="elementSelectorTop"
      :label="columnLabel(columnId)"
      :active="isColumnSelect(columnId)"
      selector-icon="fa fa-pencil"
      @element-selected="columnSelect(columnId)" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Element from '../../models/Element';
import ElementMixin from '../common/mixins/ElementMixin';
import ElementSelector from '../common/ElementSelector.vue';
import EmptyColumn from '../common/EmptyColumn.vue';
import HighlightOfElement from '../common/HighlightOfElement.vue';

module.exports = {
  name: 'ColumnDraggable',
  components: {
    Draggable,
    ElementSelector,
    EmptyColumn,
    HighlightOfElement,
  },
  mixins: [ElementMixin],
  props: ['columnId', 'column', 'columnAreaStyles', 'module'],
  data() {
    return {
      hasComponents: this.column.components.length !== 0,
      options: {
        group: {
          name: 'componentsBox',
          put: ['componentsList', 'componentsBox'],
        },
        handle: '.move',
        ghostClass: 'ghost-component', // Class name for the drop placeholder
        chosenClass: 'chosen-component', // Class name for the chosen item
        dragClass: 'drag-component', // Class name for the dragging item
      },
    };
  },
  computed: {
    components: {
      get() {
        return this.column.components;
      },
      set(value) {
        const data = {
          elementId: this.column.id,
          property: 'components',
          value,
        };
        this.$store.commit('module/saveElementProperty', data);
      },
    },
    ischanged() {
      return this.$store.getters['module/draggable'].changed;
    },
    elementSelectorTop() {
      const top = this.moduleHeight ? this.moduleHeight + 10 : 160;
      const paddingBottom = _.parseInt(
        this.module.structure.style.paddingBottom || 0,
      );
      const borderBottom = _.parseInt(
        this.module.structure.style.borderBottomWidth || 0,
      );
      return top + paddingBottom + borderBottom;
    },
  },
  methods: {
    setDragging(value) {
      this.$store.commit('module/setDraggable', {
        property: 'dragging',
        value,
      });
      this.emitChange();
    },
    emitChange() {
      this.$store.commit('module/setDraggable', {
        property: 'changed',
        value: Math.random(),
      });
    },
    getStyles(type) {
      const styles = {};
      styles.width = '100%';
      styles.left = 0;
      styles.bottom = 0;
      styles.top = 0;
      if (!this.hasComponents) {
        styles.minHeight = '150px';
        styles.height = `${this.moduleHeight}px`;
      }
      if (type === 'EmptyColumn') {
        styles.opacity = type && this.hasComponents ? 0 : 1;
      }
      if (type === 'HighlightOfElement') {
        styles.height = `${this.moduleHeight}px`;
      }
      return styles;
    },
    setHasComponents() {
      this.hasComponents =
        this.$refs.draggable &&
        Boolean(this.$refs.draggable.$el.children[0]) &&
        (this.$refs.draggable.$el.children.length > 1 ||
          this.$refs.draggable.$el.children[0].style.display !== 'none');
    },
    onAdd(e) {
      if (e.from.getAttribute('class') === 'components-list') {
        const componentId = e.newIndex;
        const colId = e.to.getAttribute('data-col');
        const type = e.clone.getAttribute('data-type');

        // Get element compatible plugins
        const plugins = {};
        _.each(this.$_app.modulePlugins, (plugin, name) => {
          if (plugin.target.indexOf(type.replace('-element', '')) !== -1) {
            plugins[name] = _.cloneDeep(plugin);
          }
        });

        // Create a new Element with default properties
        const element = new Element({ type, plugins });

        // Add it to the list
        this.$store.commit('module/addComponent', {
          el: element.getProperties(),
          index: componentId,
          colId,
        });

        // Remove ghost element
        const cloneItem = e.item;
        cloneItem.parentNode.removeChild(cloneItem);
        e.clone.style.opacity = '1';
        // Set dropped element as selected
        this.$store.commit('module/setCurrentComponent', {
          columnId: +colId,
          componentId,
        });
      }
      this.emitChange();
    },
    columnLabel(columnId) {
      let columnindex = columnId;
      if (this.isInvertedStacking) {
        columnindex = this.module.structure.columns.length - columnindex;
      } else {
        ++columnindex;
      }
      return `Column ${columnindex}`;
    },
  },
  watch: {
    draggableChanged() {
      this.$nextTick(() => {
        this.setHasComponents();
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../stensul-ui/scss/stui.scss';
.column-draggable /deep/ {
  .ghost-component,
  .ghost-component-menu {
    height: 80px;
    display: table-row;
    list-style-type: none;
    font-size: 13px;
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
    > i {
      display: none;
    }
    p {
      display: none;
    }
    & ~ tr .empty-column {
      opacity: 0;
    }
  }
}
</style>
