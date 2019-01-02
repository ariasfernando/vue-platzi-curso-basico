<template>
  <element-container :component="component" @select-component="selectComponentHandler">
    <button-border-radius-comment
      v-if="hasBorderRadius"
      :component="component"
      :module="module"
      :module-id="moduleId"
      :column-id="columnId"
      :component-id="componentId"
      :editor-id="`idInstance-${module.idInstance}-componentId-${component.id}`" />
    <div v-if="hasBorderRadius" class="stx-wrapper" v-html="notMsoStartingComment" />
    <a
      :data-contenteditable-href="component.button.attribute.href || ''"
      :target="component.button.attribute.target || '_blank'"
      :style="component.button.style.textDecoration || 'text-decoration:none;'"
      :title="component.button.attribute.title || ''"
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
            :height="component.button.attribute.height"
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
                    :editor-id="`idInstance-${module.idInstance}-componentId-${component.id}`"
                    :font-styles="fontStyles(component.button)"
                    :text="component.data.text"
                    :text-dirty="component.data.textDirty"
                    :type="component.type"
                    :config="component.plugins.textOptions"
                    @changeText="changeText" />
                </td>
                <td
                  v-if="component.caret.attribute.url"
                  :width="widthCaret"
                  :style="[elementBorderAndPadding(component.caret), {'width': widthStyle(widthCaret)}]">
                  <img
                    :src="$_app.config.imageUrl + component.caret.attribute.url"
                    :bgcolor="component.caret.attribute.bgcolor"
                    :width="component.caret.attribute.width"
                    :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                    :valign="component.caret.attribute.valign || 'middle'"
                    :class="component.caret.attribute.classes || ''"
                    style="display: inline-block !important; border:0;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </a>
    <div v-if="hasBorderRadius" class="stx-wrapper" v-html="notMsoEndingComment" />
  </element-container>
</template>

<script>
import ButtonBorderRadiusComment from '../../common/ButtonBorderRadiusComment.vue';
import ElementMixin from '../../common/mixins/ElementMixin';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementContainer from '../../common/containers/ElementContainer.vue';
import TinyMce from '../../common/tinyMce.vue';

export default {
  name: 'ButtonElement',
  components: {
    ButtonBorderRadiusComment,
    ElementContainer,
    TinyMce,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  computed: {
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
        'min-width':
          this.component.button.style.minWidth === '0px'
            ? undefined
            : this.component.button.style.minWidth,
        'max-width':
          this.component.button.style.maxWidth === '0px'
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
    notMsoStartingComment() {
      return '<!--[if !mso]><!-->';
    },
    notMsoEndingComment() {
      return '<!--<![endif]-->';
    },
    hasBorderRadius() {
      if (this.component.button.style.borderRadius) {
        const borderRadius = parseInt(this.component.button.style.borderRadius);
        return borderRadius !== 0;
      }
      return false;
    },
    buttonContainerWidth() {
      const { behaviour } = this.component;
      if (behaviour === 'text') {
        return '100%';
      }
      return this.width;
    },
  },
};
</script>
