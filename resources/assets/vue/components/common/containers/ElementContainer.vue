<template>
  <tr
    v-if="component.container.styleOption.enableElement !== false"
    :data-type="component.type"
    :element-id="component.id"
    :class="[getMobileClasses(component,'tr'), {'is-studio': isStudio}, {'is-active': isActive}]"
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
    <ComponentToolbar v-if="isStudio && isActive" :element-id="component.id" />
  </tr>
</template>

<script>
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementMixin from '../../common/mixins/ElementMixin';
import ComponentToolbar from '../../admin/elements/ComponentToolbar.vue';

export default {
  name: 'ElementContainer',
  components: {
    ComponentToolbar,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  methods: {
    clickOnComponent(e) {
      this.$emit('select-component', e);
    },
  },
};
</script>
<style lang="scss" scoped>
.is-studio.is-active > td:before {
  content: '';
  pointer-events: none;
  position: absolute;
  background: none;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: block;
  outline: 2px solid #69dac8;
  outline-offset: -1px;
  z-index: 298;
}
</style>
