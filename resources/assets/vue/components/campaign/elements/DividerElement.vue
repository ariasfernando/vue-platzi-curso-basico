<template>
  <!-- DIVIDER ELEMENT -->
  <module-container :component="component" @select-component="selectComponentHandler">
    <table
      width="100%"
      style="width: 100%;"
      :style="tableStyle"
      :align="component.container.attribute.align"
      border="0"
      cellpadding="0"
      cellspacing="0"
    >
        <spacer 
          :valign="component.divider.attribute.valign"
          :align="component.divider.attribute.align"
          :bgcolor="component.divider.attribute.bgcolor"
          :height="component.divider.style.height"
        ></spacer>
    </table>
  </module-container>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin';
  import Spacer from '../../common/Spacer';
  import _ from 'underscore';
  
  export default {
    name: 'DividerElement',
    components: {
      ModuleContainer,
      Spacer
    },
    mixins: [ MobileStylesMixin, ElementMixin ],
    computed: {
      tableStyle() {
        return {
          height: this.component.divider.style.height,
          lineHeight: this.component.divider.style.height,
          fontSize: this.component.divider.style.height,
        };
      },
    },
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>
