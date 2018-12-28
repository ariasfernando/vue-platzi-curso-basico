<template>
  <div>
    <Draggable
      :ref="'draggable'"
      v-model="components"
      style="display: table; width: 100%;"
      element="div"
      :options="options"
      :data-col="columnId"
      :style="getStyles('draggable')"
      class="column-draggable"
      :class="hasComponents ? 'has-component': 'no-component'"
      :move="emitChange"
      @clone="emitChange"
      @sort="emitChange"
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
      :top="moduleHeight ? moduleHeight+10 : 160"
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
        this.emitChange();
      },
    },
    ischanged() {
      return this.$store.getters['module/draggable'].changed;
    },
  },
  mounted() {
    this.emitChange();
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
      if (type === 'draggable') {
        styles.width = '100%';
      }
      if (type === 'EmptyColumn') {
        styles.opacity = type && this.hasComponents ? 0 : 1;
      } if (type === 'HighlightOfElement') {
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
    module: {
      handler() {
        this.$nextTick(() => {
          this.setHasComponents();
        });
      },
      deep: true,
    },
    draggableChanged() {
      this.$nextTick(() => {
        this.setHasComponents();
      });
    },
    moduleHeight() {
      this.$nextTick(() => {
        this.setHasComponents();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../stensul-ui/scss/stui.scss';
</style>
