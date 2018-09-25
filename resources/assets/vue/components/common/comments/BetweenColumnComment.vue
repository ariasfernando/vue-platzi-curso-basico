
<template>
  <line-comment
    :key="'comment-' + columnId"
    :comment="msoBetweenComment">
  </line-comment>
</template>

<script>
import LineComment from './LineComment';
import ElementMixin from '../mixins/ElementMixin';
export default {
  name: 'BetweenColumnComment',
  props: ['width', 'bgcolor', 'is-inverted'],
  mixins: [ElementMixin],
  components: {
    LineComment
  },
  computed: {
    msoBetweenComment() {
      return `<!--[if gte mso 9]>
            </td>
            <td width="${this.width}" ${this.bgcolor ? `bgcolor="${this.bgcolor}" ` : ''}style="width: ${this.widthStyle(this.width)}" ${this.isInverted ? 'dir="ltr" ' : ''}align="left" valign="top">
              <![endif]-->`;
    },
  }
};
</script>