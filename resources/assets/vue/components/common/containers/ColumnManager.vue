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
        <columns-comment
          :is-inverted="isInvertedStacking"
          :wrapper-width="templateInnerWidth"
          :width-first-column="columnWidth(0)"
          :bgcolor="columnBgcolor(0)"
          >
          <template v-for="(column, columnId) in module.structure.columns">
            <column-render
              :key="'column-' + columnId"
              :module-id="moduleId"
              :column="column"
              :data-column-id="columnId"
              :column-id="column.id"
              :is-inverted="isInvertedStacking">
              <slot :columnData="{columnId, column}"></slot>
              <element-selector
                v-if="!isCampaign && buildingMode === 'desktop'"
                :key="'selector' + columnId"
                :left-position="calculeLeftPosition(columnId)"
                :label="`Column ${columnId+1}`"
                :active="isColumnSelect(columnId)"
                selectorIcon="fa fa-pencil"
                @element-selected="columnSelect(columnId)" />
            </column-render>
            <between-column-comment
              v-if="module.structure.columns.length -1 > columnId"
              :is-inverted="isInvertedStacking"
              :key="'comment-' + columnId"
              :width="columnWidth(columnId + 1)"
              :bgcolor="columnBgcolor(columnId + 1)">
            </between-column-comment>
          </template>
        </columns-comment>
      </td>
       <!-- columns fixed -->
      <td
        v-else-if="module.structure.columnsStacking == 'columnsFixed'"
        v-for="(column, columnId) in module.structure.columns"
        :key="column.id"
        :data-column-id="columnId"
        :column-id="column.id"
        :width="columnWidth(columnId)"
        :valign="column.container.attribute.valign || 'top'"
        :class="column.container.attribute.classes"
        :height="column.container.attribute.height"
        :bgcolor="column.container.attribute.bgcolor"
        :style="[elementBorderPaddingAndHeight(column.container), {'width': widthStyle(columnWidth(columnId))}]"
        >
        <table align="left" width="100%" cellspacing="0" cellpadding="0" border="0">
          <slot :columnData="{columnId, column}"></slot>
          <element-selector
            v-if="!isCampaign && buildingMode === 'desktop'"
            :left-position="calculeLeftPosition(columnId)"
            :width-column="columnWidth(columnId)"
            :label="`Column ${columnId+1}`"
            selectorIcon="fa fa-pencil" 
            :active="isColumnSelect(columnId)"
            @element-selected="columnSelect(columnId)" />
        </table>
      </td>
    </tr>
    <!--  1 column -->
    <slot v-else :columnData="{columnId, column}" v-for="(column, columnId) in module.structure.columns" :data-column-id="columnId" :column-id="column.id" ></slot>
  </wrapper>
</template>

<script>
import ElementSelector from '../ElementSelector.vue';
import ColumnRender from './ColumnRender.vue';
import ElementMixin from '../mixins/ElementMixin.js';
import BetweenColumnComment from '../comments/BetweenColumnComment';
import ColumnsComment from '../comments/ColumnsComment';
import Wrapper from '../Wrapper';

export default {
  name: 'ColumnManager',
  mixins: [ElementMixin],

  components: {
    ColumnRender,
    ElementSelector,
    BetweenColumnComment,
    ColumnsComment,
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
