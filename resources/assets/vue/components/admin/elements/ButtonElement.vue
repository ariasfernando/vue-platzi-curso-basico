<template>
  <module-container :component="component" :is-active="isActive" @select-component="selectComponentHandler">
    <a
      :data-contenteditable-href="component.button.attribute.href || ''"
      :target="component.button.attribute.target || '_blank'"
      :style="component.button.style.textDecoration || 'text-decoration:none;'"
      @click.prevent>
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        :width="buttonContainerWidth"
        :style="tableStyles">
        <tr>
          <td
            width="100%"
            :bgcolor="component.button.attribute.bgcolor"
            :height="component.button.attribute.height === 'auto' ? undefined : component.button.attribute.height"
            style="vertical-align: middle; width:100%;"
            :style="elementBorderPaddingAndHeight(component.button)">
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="width:100%">
              <tr>
                <td
                  width="100%"
                  :align="component.button.attribute.align"
                  :style="fontStyles(component.button)"
                  :valign="component.button.attribute.valign || ''">
                  <tiny-mce
                    :editor-id="`moduleId-${component.id}`"
                    :font-styles="fontStyles(component.button)"
                    :text="component.data.text"
                    :type="component.type"
                    :text-dirty="component.data.textDirty"
                    :config="textOptions"
                    @changeText="changeText" />
                </td>
                <td
                  v-if="component.caret.attribute.url"
                  :width="widthCaret"
                  :style="[elementBorderAndPadding(component.caret), {'width': widthCaret +'px'}]">
                  <img
                    :src="$_app.config.imageUrl + component.caret.attribute.url"
                    :bgcolor="component.caret.attribute.bgcolor"
                    :width="component.caret.attribute.width"
                    :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                    :valign="component.button.attribute.valign || 'middle'"
                    style="display: inline-block !important; border:0;">
                </td>
              </tr>
            </table>
            <component-toolbar :component-id="componentId" :column-id="columnId" />
          </td>
        </tr>
      </table>
    </a>
  </module-container>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>

import ComponentToolbar from './ComponentToolbar.vue';
import ElementMixin from '../../common/mixins/ElementMixin';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ModuleContainer from '../../common/containers/ModuleContainer.vue';
import textOptions from '../settingsDefault/TextOptions';
import TinyMce from '../../common/tinyMce.vue';

export default {
  name: 'ButtonElement',
  components: {
    ComponentToolbar,
    ModuleContainer,
    TinyMce,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  computed: {
    buttonContainerWidth() {
      const { behaviour } = this.component;
      if (behaviour === 'text') {
        return '100%';
      }
      return this.width;
    },
    textOptions() {
      return textOptions();
    },
    width() {
      return this.component.button.styleOption.autoWidth
        ? undefined
        : this.component.button.attribute.width;
    },
    tableStyles() {
      const { behaviour } = this.component;
      let width = this.width ? this.widthStyle(this.width) : undefined;
      if (behaviour === 'text') {
        width = '100%';
      }
      return {
        width,
        'min-width': this.component.button.style.minWidth === '0px'
            ? undefined
            : this.component.button.style.minWidth,
        'max-width': this.component.button.style.maxWidth === '0px'
            ? undefined
            : this.component.button.style.maxWidth,
        'border-collapse': 'initial',
      };
    },
    widthCaret() {
      return (
        _.parseInt(this.component.caret.attribute.width) +
          _.parseInt(this.component.caret.style.paddingLeft) ||
        0 + _.parseInt(this.component.caret.style.paddingRight) ||
        0
      );
    },
  },
};
</script>
