<template>
  <element-container :component="component" @select-component="selectComponentHandler">
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
              :editor-id="`idInstance-${module.idInstance}-componentId-${component.id}`"
              :font-styles="fontStyles(component.text)"
              :text="component.data.text"
              :type="component.type"
              :text-dirty="component.data.textDirty"
              :config="component.plugins.textOptions"
              @changeText="changeText" />
          </td>
        </tr>
      </table>
    </a>
  </element-container>
</template>

<script>
import ElementMixin from '../../common/mixins/ElementMixin';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementContainer from '../../common/containers/ElementContainer.vue';
import TinyMce from '../../common/tinyMce.vue';

export default {
  name: 'TextElement',
  components: {
    ElementContainer,
    TinyMce,
  },
  mixins: [MobileStylesMixin, ElementMixin],
};
</script>
