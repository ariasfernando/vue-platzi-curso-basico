<template>
  <Wrapper>
    <tr
      v-if="withRow"
      :data-type="element.type"
      :data-row-id="element.id"
      @mouseover="isHover = true"
      @mouseleave="isHover = false">
      <td
        width="100%"
        :height="element.container.attribute.height"
        :style="elementBorderPaddingAndHeight(element.container)"
        :valign="element.container.attribute.valign || 'top'"
        :align="element.container.attribute.align || 'left'"
        class="stx-position-relative"
        :bgcolor="element.container.attribute.bgcolor"
        :class="[element.container.attribute.classes, {'hide-element-selector' : !isHover && isStudio}]">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          :width="element.container.attribute.width"
          :style="`width: ${widthStyle(element.container.attribute.width)}`">
          <tr v-if="element.content">
            <td
              width="100%"
              :height="element.content.attribute.height"
              :style="elementBorderPaddingAndHeight(element.content)"
              :valign="element.content.attribute.valign || 'top'"
              :align="element.content.attribute.align || 'left'"
              class="stx-position-relative"
              :bgcolor="element.content.attribute.bgcolor"
              :class="element.content.attribute.classes">
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                :width="element.content.attribute.width"
                :style="`width: ${widthStyle(element.content.attribute.width)}`">
                <slot />
              </table>
            </td>
          </tr>
          <slot v-else />
        </table>
        <ElementSelector
          v-if="isStudio"
          class="row"
          :left-position="templateWidth + 40"
          :bottom="elementSelectorTop/2 - 10"
          :width="50"
          label="Row"
          :active="currentElementId === element.id"
          selector-icon="fa fa-cog"
          @element-selected="$emit('select-component', element.id)" />
      </td>
    </tr>
    <template v-else>
      <slot />
      <ElementSelector
        v-if="isStudio"
        class="row"
        :left-position="templateWidth + 40"
        :bottom="elementSelectorTop/2 - 10"
        :width="50"
        label="Row"
        :active="currentElementId === element.id"
        selector-icon="fa fa-cog"
        @element-selected="$emit('select-component', element.id)" />
    </template>
  </Wrapper>
</template>

<script>
import ElementMixin from '../../common/mixins/ElementMixin';
import Wrapper from '../Wrapper.vue';
import ElementSelector from '../ElementSelector.vue';

export default {
  name: 'RowContainer',
  components: {
    ElementSelector,
    Wrapper,
  },
  mixins: [ElementMixin],
  data() {
    return {
      isHover: false,
    };
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
