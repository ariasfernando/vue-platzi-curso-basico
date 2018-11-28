<template>
  <element-container :component="component" :is-active="isActive" @select-component="selectComponentHandler">
    <a
      :data-contenteditable-href="component.text.attribute.href"
      :style="component.text.style.textDecoration || 'text-decoration:none;'"
      :target="component.text.attribute.target || '_blank'"
      @click.prevent>
      <table
        :width="component.text.attribute.width || '100%'"
        :style="{'width': widthStyle(component.text.attribute.width) || '100%'}"
        :align="component.container.attribute.align"
        border="0"
        cellpadding="0"
        cellspacing="0">
        <tr>
          <td
            class="stx-edit-text stx-position-relative"
            width="100%"
            :valign="component.text.attribute.valign || 'top'"
            :align="component.text.attribute.align || 'left'"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[fontStyles(component.text), elementBorderAndPadding(component.text), {width:'100%'}]">
            <tiny-mce
              :editor-id="`componentId-${component.id}`"
              :font-styles="fontStyles(component.text)"
              :text="component.data.text"
              :type="component.type"
              :text-dirty="component.data.textDirty"
              :config="textOptions"
              @changeText="changeText" />
            <component-toolbar v-if="isStudio" :component-id="componentId" :column-id="columnId" />
          </td>
        </tr>
      </table>
    </a>
  </element-container>
</template>

<script>
import ComponentToolbar from './ComponentToolbar.vue';
import ElementMixin from '../../common/mixins/ElementMixin';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementContainer from '../../common/containers/ElementContainer.vue';
import TinyMce from '../../common/tinyMce.vue';

export default {
  name: 'TextElement',
  components: {
    ComponentToolbar,
    ElementContainer,
    TinyMce,
  },
  mixins: [MobileStylesMixin, ElementMixin],
};
</script>

<style lang="less">
.stx-position-relative {
  position: relative;
}
</style>
