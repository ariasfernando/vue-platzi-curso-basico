<template>
  <!-- DIVIDER ELEMENT -->
  <element-container :component="component" @select-component="selectComponentHandler">
    <table
      :width="component.divider.attribute.width || '100%'"
      :style="tableStyle"
      :align="component.divider.attribute.align"
      border="0"
      cellpadding="0"
      cellspacing="0">
      <spacer
        :valign="component.divider.attribute.valign"
        :align="component.divider.attribute.align"
        :bgcolor="component.divider.attribute.bgcolor"
        :height="component.divider.attribute.height || component.divider.style.height" />
    </table>
  </element-container>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
  import ElementContainer from '../../common/containers/ElementContainer.vue';
  import ElementMixin from '../../common/mixins/ElementMixin';
  import Spacer from '../../common/Spacer.vue';

  export default {
    name: 'DividerElement',
    components: {
      ElementContainer,
      Spacer,
    },
    mixins: [MobileStylesMixin, ElementMixin],
    computed: {
      tableStyle() {
        return {
          width: this.widthStyle(this.component.divider.attribute.width || '100%'),
          height: this.component.divider.style.height,
          lineHeight: this.component.divider.style.height,
          fontSize: this.component.divider.style.height,
        };
      },
    },
  };
</script>

<style lang="less">
.stx-line-height-reset {
  line-height: 0;
}
</style>
