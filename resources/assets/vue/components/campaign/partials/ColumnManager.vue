<template>
<wrapper>
  <!-- more than 1 column -->
  <tr v-if="structure.columns.length > 1">
    <!-- columns stacking -->
    <td
      v-if="structure.columnsStacking === 'normal' || isInvertedStacking"
      width="100%"
      style="width:100%;"
      :valign="structure.attribute.valign || 'top'"
      >
      <wrapper-comment
        :start="msoStartingComment"
        :end="msoEndingComment">
        <template v-for="(column, columnId) in columnsSort">
          <column-render
            :key="'column-' + columnId"
            :module-id="moduleId"
            :column="column"
            :column-id="columnId"
            :is-inverted="isInvertedStacking">
              <slot :columnData="{columnId, column}"></slot>
            </column-render>
            <line-comment
              v-if="columnsSort.length -1 > columnId"
              :key="'comment-' + columnId"
              :comment="msoBetweenComment(columnId)">
            </line-comment>
          </template>
        </wrapper-comment>
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
        </table>
      </td>
    </tr>
    <!--  1 column -->
    <slot v-else :columnData="{columnId, column}" v-for="(column, columnId) in columnsSort" ></slot>
  </wrapper>
</template>

<script>
import ColumnRender from './ColumnRender.vue';
import ElementMixin from '../../common/mixins/ElementMixin.js';
import LineComment from '../../common/comments/LineComment';
import WrapperComment from '../../common/comments/WrapperComment';
import Wrapper from '../../common/Wrapper';

export default {
  name: 'ColumnManager',
  mixins: [ElementMixin],

  components: {
    ColumnRender,
    LineComment,
    WrapperComment,
    Wrapper
  },
  props: [
    'isInverted',
    'structure',
  ],
  computed: {
    columnsSort() {
      return this.isInvertedStacking
        ? this.structure.columns.reverse()
        : this.structure.columns;
    },
    isInvertedStacking() {
      return this.structure.columnsStacking === 'invertedStacking';
    },
    msoStartingComment() {
      return `<!--[if gte mso 9]>
        <table width="${this.templateInnerWidth}" style="width:${this.widthStyle(this.templateInnerWidth)}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center" ${this.isInvertedStacking ? 'dir="rtl"' : ''}>
          <tr>
            <td width="${this.columnWidth(0)}" ${this.columnBgcolor(0)} style="width:${this.widthStyle(this.columnWidth(0))}" ${this.isInvertedStacking ? 'dir="ltr"' : ''} valign="top">
            <![endif]-->`;
    },
    msoEndingComment() {
      return `<!--[if gte mso 9]>
            </td>
          </tr>
        </table>
      <![endif]-->`;
    }
  },
  methods: {
    msoBetweenComment(columnId) {
      return `<!--[if gte mso 9]>
            </td>
            <td width="${this.columnWidth(columnId + 1)}" ${this.columnBgcolor(columnId+1)} style="width: ${this.widthStyle(this.columnWidth(columnId +1))}" ${this.isInvertedStacking ? 'dir="ltr"' : ''} align="left" valign="top">
              <![endif]-->`;
    },
  }
};
</script>
