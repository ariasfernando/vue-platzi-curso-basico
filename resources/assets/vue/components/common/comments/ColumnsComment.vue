
<template>
  <wrapper-comment
    :start="msoStartingComment"
    :end="msoEndingComment">
    <slot></slot>
  </wrapper-comment>
</template>

<script>
import WrapperComment from './WrapperComment';
import ElementMixin from '../mixins/ElementMixin';
export default {
  name: 'ColumnsComment',
  props: ['is-inverted-stacking', 'width-first-column', 'bgcolor', 'wrapper-width'],
  mixins: [ElementMixin],
  components: {
    WrapperComment
  },
  computed: {
    msoStartingComment() {
      return `<!--[if gte mso 9]>
        <table width="${this.wrapperWidth}" style="width:${this.widthStyle(this.wrapperWidth)}" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; table-width: fixed;" align="center" ${this.isInvertedStacking ? 'dir="rtl"' : ''}>
          <tr>
            <td width="${this.widthFirstColumn}" ${this.bgcolor ? `bgcolor="${this.bgcolor}" ` : ''}style="width:${this.widthStyle(this.widthFirstColumn)}" ${this.isInvertedStacking ? 'dir="ltr" ' : ''}valign="top">
            <![endif]-->`;
    },
    msoEndingComment() {
      return `<!--[if gte mso 9]>
            </td>
          </tr>
        </table>
      <![endif]-->`;
    }
  }
};
</script>