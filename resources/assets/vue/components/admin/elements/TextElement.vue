<template>
  <module-container :component="component" :is-active="isActive" @select-component="selectComponentHandler">
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
              :id="editorId"
              :style="fontStyles(component.text)"
              :value="component.data.text"
              data-key="text"
              :settings="component.plugins.textOptions.config.settings" />
            <component-toolbar :component-id="componentId" :column-id="columnId" />
          </td>
        </tr>
      </table>
    </a>
  </module-container>
</template>

<script>
import TinyMce from './TinyMce.vue';
import ComponentToolbar from './ComponentToolbar.vue';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementMixin from '../../common/mixins/ElementMixin';
import ModuleContainer from '../../common/containers/ModuleContainer.vue';

export default {
  name: 'TextElement',
  components: {
    TinyMce,
    ComponentToolbar,
    ModuleContainer,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  data() {
    return {
      editorId: ['editor', this.columnId, this.componentId].join('-'),
      dirty: false,
    };
  },
};
</script>

<style lang="less">
.stx-position-relative {
  position: relative;
}

.stx-edit-text {
  p {
    margin: 0;
    padding: 0;
  }
}
</style>
