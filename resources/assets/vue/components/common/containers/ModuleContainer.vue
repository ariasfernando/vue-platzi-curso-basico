<template>
    <tr
      :data-type="component.type"
      :component-id="component.id"
      :class="getMobileClasses(component,'tr')"
      @click.prevent="clickOnComponent"
      v-if="component.container.styleOption.enableElement !== false"
    >
      <td
        :width="component.container.attribute.width || '100%'"
        :height="component.container.attribute.height"
        :style="elementBorderPaddingAndWidth(component.container)"
        :valign="component.container.attribute.valign || 'top'"
        :align="component.container.attribute.align || 'left'"
        class="stx-position-relative"
        :bgcolor="component.container.attribute.bgcolor"
        :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
      >
        <slot></slot>
      </td>
  </tr>
</template>
    
<script>
  import _ from 'lodash';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  
  export default {
    name: 'ModuleContainer',
    props: ['component'],
    mixins: [ MobileStylesMixin, ElementMixin ],

    methods: {
      clickOnComponent(e){
        this.$emit("select-component", e);
      },
    },
  };
</script>