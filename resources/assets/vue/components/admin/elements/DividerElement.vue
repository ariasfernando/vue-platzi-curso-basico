<template>
  <!-- DIVIDER ELEMENT -->
  <module-container :component="component" @select-component="selectComponentHandler">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="width: 100%;"
      :style="tableStyle"
    >
        <spacer 
          :valign="component.divider.attribute.valign"
          :align="component.divider.attribute.align"
          :bgcolor="component.divider.attribute.bgcolor"
          :height="component.divider.style.height"
        ></spacer>
    </table>
    <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
  </module-container>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin';
  import MontedElementMixin from '../mixins/MontedElementMixin';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import Spacer from '../../common/Spacer';
  
  export default {
    name: 'DividerElement',
    components: {
      ComponentToolbar,
      ModuleContainer,
      Spacer
    },
    mixins: [ MobileStylesMixin, ElementMixin, MontedElementMixin ],
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
  @icon-option: #69dac8;

  .st-divider {
    width: 100%;
    border: none;
  }

  .stx-position-relative{
    position: relative;
  }

  .stx-line-height-reset{
    line-height: 0;
  }
</style>
