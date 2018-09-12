<template>
  <wrapper>
    <!-- more than 1 column -->
    <tr v-if="module.structure.columns.length > 1">
      <!-- columns stacking -->
      <td
        v-if="module.structure.columnsStacking === 'normal' || isInvertedStacking"
        width="100%"
        style="width:100%;"
        :valign="module.structure.attribute.valign || 'top'"
        >
        <template v-for="(column, columnId) in columnsSort">
          <column-render
            :key="'column-' + columnId"
            :module-id="moduleId"
            :column="column"
            :column-id="columnId"
            class="st-content-component"
            :is-inverted="isInvertedStacking">
            <slot :columnData="{columnId, column}"></slot>
            <element-selector :left-position="calculeLeftPosition(columnId)" :key="'selector' + columnId" :label="`Col ${columnId}`" @element-selected="columnSelect(columnId)" :active="isColumnSelect(columnId)" selectorIcon="fa fa-pencil"></element-selector>
          </column-render>
        </template>
      </td>
       <!-- columns fixed -->
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
          <slot :columnData="{columnId, column}"></slot>
          <element-selector :left-position="calculeLeftPosition(columnId)" :width-column="columnWidth(columnId)" :label="`Col ${columnId}`" @element-selected="columnSelect(columnId)" :active="isColumnSelect(columnId)" selectorIcon="fa fa-pencil"></element-selector>
        </table>
      </td>
    </tr>
    <!--  1 column -->
    <div
      v-else
      v-for="(column, columnId) in columnsSort"
      :key="'column-' + columnId">
      <slot :columnData="{columnId, column}"></slot>
    </div>
  </wrapper>
</template>

<script>
import ElementSelector from '../../common/ElementSelector.vue';
import ColumnRender from '../../common/containers/ColumnRender.vue';
import ElementMixin from '../../common/mixins/ElementMixin.js';
import Wrapper from '../../common/Wrapper';

export default {
  name: 'ColumnManager',
  mixins: [ElementMixin],

  components: {
    ColumnRender,
    ElementSelector,
    Wrapper
  },
  methods: {
    calculeLeftPosition(col) {
      let leftPosition = 0;
      for (let index = 0; index < col; index++) {
        leftPosition += this.columnWidth(index);
      }
      leftPosition += this.columnWidth(col) / 2;
      return leftPosition;
    }
  }
};
</script>
