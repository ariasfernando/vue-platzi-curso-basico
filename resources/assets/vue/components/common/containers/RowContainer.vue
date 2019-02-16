<template>
  <Wrapper>
    <tr
      v-if="withRow"
      :data-type="element.type"
      :data-row-id="element.id"
      :class="element.container.attribute.classes">
      <td
        width="15%"
        :height="element.container.attribute.height"
        :style="elementBorderPaddingAndHeight(element.container)"
        :valign="element.container.attribute.valign || 'top'"
        :align="element.container.attribute.align || 'left'"
        class="stx-position-relative"
        :bgcolor="element.container.attribute.bgcolor"
        :class="element.container.attribute.classes">
        <table
          v-if="element.content"
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="width: 100%;">
          <tr>
            <td
              width="100%"
              :height="element.content.attribute.height"
              :style="elementBorderPaddingAndHeight(element.content)"
              :valign="element.content.attribute.valign || 'top'"
              :align="element.content.attribute.align || 'left'"
              class="stx-position-relative"
              :bgcolor="element.content.attribute.bgcolor"
              :class="element.content.attribute.classes">
              <slot />
            </td>
          </tr>
        </table>
        <slot v-else />
      </td>
    </tr>
    <slot v-else />
  </Wrapper>
</template>

<script>
import ElementMixin from '../../common/mixins/ElementMixin';
import Wrapper from '../Wrapper';

export default {
  name: 'RowContainer',
  mixins: [ElementMixin],
  components: {
    Wrapper,
  },
};
</script>
<style lang="scss">
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
