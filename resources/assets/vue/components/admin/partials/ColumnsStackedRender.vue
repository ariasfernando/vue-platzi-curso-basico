<template>
  <div :class="module.structure.columnsStacking === 'invertedStacking' ? 'st-inverted-stacking' : ''">
    <table
      v-if="column.components.length"
      v-for="(column, columnId) in module.structure.columns"
      :width="column.container.attribute.width"
      :style="{'background-color' : column.container.attribute.bgcolor}" 
      :data-col="columnId"
      align="left"
      cellpadding="0" 
      cellspacing="0" 
      border="0" 
      :class="`st-content-component ${column.container.attribute.width === '100%' ? '' : 'st-mobile-full-width'}`"
      :bgcolor="column.container.attribute.bgcolor"
      :key="column.id"
    >
      <tr>
        <td
          width="100%" 
          :style="elementBorderPaddingAndHeight(module.structure.columns[columnId].container)"
          :class="column.container.attribute.classes ||''"
        >
          <draggable
            v-model="column.components"
            @add="onAdd"
            :element="'table'"
            :options="options" 
            :data-col="columnId"
            cellpadding="0" 
            cellspacing="0" 
            border="0"
            width="100%"
          >
            <component
              v-for="(component, componentId) in column.components"
              :is="component.type"
              :component="component"
              :module-id="module.id"
              :column-id="columnId"
              :component-id="componentId"
              :key="componentId"
              @set-component="selection => $emit('set-component', selection)"
              class="st-component"></component>
          </draggable>
        </td>
      </tr>  
      <element-selector :label="`Col ${columnId}`" @element-selected="columnSelect(columnId)" :active="isColumnSelect(columnId)" selectorIcon="fa fa-pencil"></element-selector>
    </table>

    <!-- Empty Col -->
    <table
      v-else 
      align="left"
      :style="column.container.style || ''"
      :width="column.container.style && column.container.attribute.width ? column.container.attribute.width : 100/module.structure.columns.length + '%'"
    >
      <tr>
        <td>
          <draggable
            @add="onAdd"
            :element="'div'" 
            :options="options" 
            :data-col="columnId"
            cellpadding="0" 
            cellspacing="0" 
            border="0"
            width="100%"
            class="empty-table"
          >
            <div style="display:table-row;"> 
              <div
                align="center"
                class="empty-cell"
                height="80"
                :data-col="columnId">
                Drag content here
              </div>
            </div>
          </draggable>
        </td>
      </tr>
    </table>
  </div>

</template>

<script>
import _ from "lodash";
import Draggable from "vuedraggable";
import TextElement from "../elements/TextElement.vue";
import ButtonElement from "../elements/ButtonElement.vue";
import ElementSelector from '../../common/ElementSelector.vue';
import ImageElement from "../elements/ImageElement.vue";
import DividerElement from "../elements/DividerElement.vue";
import ElementMixin from '../../common/mixins/ElementMixin.js';

export default {
  name: "ColumnsStackedRender",
  mixins: [ ElementMixin ],
  components: {
    Draggable,
    TextElement,
    ButtonElement,
    ElementSelector,
    ImageElement,
    DividerElement,
  },
  data() {
    return {
      options: {
        group: {
          name: "componentsBox",
          put: ["componentsList", "componentsBox"]
        },
        handle: ".icon-move",
        ghostClass: "ghost-component", // Class name for the drop placeholder
        chosenClass: "chosen-component", // Class name for the chosen item
        dragClass: "drag-component" // Class name for the dragging item
      }
    };
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    }
  },
  methods: {
    onAdd(e) {
      this.$emit("add", e);
    }
  }
};
</script>
