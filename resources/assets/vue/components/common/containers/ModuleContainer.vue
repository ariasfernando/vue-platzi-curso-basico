<template>
  <tr
    v-if="component.container.styleOption.enableElement !== false"
    :data-type="component.type"
    :element-id="component.id"
    :class="[getMobileClasses(component,'tr'), {'is-active': isActive}]"
    @mousedown="clickOnComponent">
    <td
      width="100%"
      :height="component.container.attribute.height"
      :style="elementBorderPaddingAndHeight(component.container)"
      :valign="component.container.attribute.valign || 'top'"
      :align="component.container.attribute.align || 'left'"
      class="stx-position-relative"
      :bgcolor="component.container.attribute.bgcolor"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]">
      <slot />
    </td>
  </tr>
</template>

<script>
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementMixin from '../../common/mixins/ElementMixin';

export default {
  name: 'ModuleContainer',
  mixins: [MobileStylesMixin, ElementMixin],
  methods: {
    clickOnComponent(e) {
      this.$emit('select-component', e);
    },
  },
};
</script>
