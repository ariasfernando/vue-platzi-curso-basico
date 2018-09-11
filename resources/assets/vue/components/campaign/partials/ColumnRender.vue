<template>
  <table
    class="st-mso-full-width st-mobile-full-width"
    :data-column-id="columnId"
    :align="isInverted ? 'right' : 'left'"
    :dir="isInverted ? 'ltr' : undefined"
    cellpadding="0"
    cellspacing="0"
    border="0"
    :width="columnWidth(columnId)"
    :style="{width: widthStyle(columnWidth(columnId))}"
  >
    <tr>
      <td
        width="100%"
        :align="column.container.attribute.align || 'center'"
        style="width:100%;"
        :bgcolor="column.container.attribute.bgcolor"
        :class="column.container.attribute.classes"
        :height="column.container.attribute.height"
        :style="elementBorderPaddingAndHeight(column.container)"
        :valign="column.container.attribute.valign || 'top'"
      >
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <slot></slot>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import ElementMixin from '../../common/mixins/ElementMixin.js';

export default {
  name: 'ColumnRender',
  mixins: [ElementMixin],
  props: ['moduleId', 'column', 'columnId', 'isInverted'],
};
</script>
