<template>
  <Wrapper>
    <!-- more than 1 column -->
    <tr v-if="module.structure.columns.length > 1">
      <!-- columns stacking -->
      <td
        v-if="module.structure.columnsStacking === 'normal' || isInvertedStacking"
        width="100%"
        style="width:100%;"
        :valign="module.structure.attribute.valign || 'top'">
        <ColumnsComment
          :is-inverted="isInvertedStacking"
          :wrapper-width="templateInnerWidth"
          :width-first-column="columnWidth(0)"
          :bgcolor="columnBgcolor(0)"
          :module="module">
          <template v-for="(column, columnId) in module.structure.columns">
            <ColumnRender
              :key="'column-' + columnId"
              :module-id="moduleId"
              :column="column"
              :data-column-id="columnId"
              :column-id="column.id"
              :module="module"
              :is-inverted="isInvertedStacking">
              <slot :columnData="{columnId, column}" />
            </ColumnRender>
            <BetweenColumnComment
              v-if="module.structure.columns.length -1 > columnId"
              :key="'comment-' + columnId"
              :is-inverted="isInvertedStacking"
              :width="columnWidth(columnId + 1)"
              :bgcolor="columnBgcolor(columnId + 1)" />
          </template>
        </ColumnsComment>
      </td>
      <!-- columns fixed -->
      <td
        v-for="(column, columnId) in columnsFixed"
        :key="column.id"
        :data-column-id="columnId"
        :column-id="column.id"
        :width="columnWidth(columnId)"
        :valign="column.container.attribute.valign || 'top'"
        :class="column.container.attribute.classes"
        :height="column.container.attribute.height"
        :bgcolor="column.container.attribute.bgcolor"
        :style="[elementBorderPaddingAndHeight(column.container), {width: widthStyle(columnWidth(columnId))}]">
        <table align="left" width="100%" cellspacing="0" cellpadding="0" border="0">
          <slot :columnData="{columnId, column}" />
        </table>
      </td>
    </tr>
    <!--  1 column -->
    <slot
      v-for="(column, columnId) in module.structure.columns"
      v-else
      :columnData="{columnId, column}"
      :data-column-id="columnId"
      :column-id="column.id" />
  </Wrapper>
</template>

<script>
import BetweenColumnComment from '../comments/BetweenColumnComment.vue';
import ColumnRender from './ColumnRender.vue';
import ColumnsComment from '../comments/ColumnsComment.vue';
import ElementMixin from '../mixins/ElementMixin';
import Wrapper from '../Wrapper.vue';

export default {
  name: 'ColumnManager',
  components: {
    BetweenColumnComment,
    ColumnRender,
    ColumnsComment,
    Wrapper,
  },
  mixins: [ElementMixin],
  computed: {
    columnsFixed() {
      if (this.module.structure.columnsStacking === 'columnsFixed') {
        return this.module.structure.columns;
      }
      return [];
    },
  },
};
</script>
