<template>
  <ElementContainer :component="component" @select-component="selectComponentHandler">
    <ButtonBorderRadiusComment
      v-if="applyBorderRadiusComment"
      :component="component"
      :module="module"
      :module-id="moduleId"
      :row-index="rowIndex"
      :column-id="columnId"
      :component-id="componentId"
      :editor-id="`idInstance-${module.idInstance}-componentId-${component.id}`" />
    <div v-if="applyBorderRadiusComment" class="stx-wrapper" v-html="notMsoStartingComment" />
    <a
      :data-contenteditable-href="component.button.attribute.href || ''"
      :target="component.button.attribute.target || '_blank'"
      :style="component.button.style.textDecoration || 'text-decoration:none;'"
      :title="component.button.attribute.title || ''"
      :data-description="component.button.attribute.dataDescription || ''"
      @click.prevent>
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        :data-persist-styles="persistStyles"
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
                  :width="component.caret.attribute.url ? undefined : '100%'"
                  :align="component.button.attribute.align"
                  :style="fontStyles(component.button)"
                  :valign="component.button.attribute.valign || ''">
                  <!-- this tag is used to enable clicking the button in Outlook -->
                  <a
                    :data-contenteditable-href="component.button.attribute.href || ''"
                    :target="component.button.attribute.target || '_blank'"
                    :data-persist-styles="JSON.stringify({'mso-line-height-rule': 'exactly', 'line-height': lineHeightCalculate(component.button)})"
                    :style="component.button.style.textDecoration || 'text-decoration:none;'"
                    class="stx-display-block"
                    :title="component.button.attribute.title || ''"
                    :data-description="component.button.attribute.dataDescription || ''"
                    @click.prevent>
                    <TinyMce
                      :editor-id="getTinyId(element.id, module.idInstance)"
                      :font-styles="fontStyles(component.button)"
                      :text="component.data.text"
                      :text-dirty="component.data.textDirty"
                      :type="component.type"
                      :config="component.plugins.textOptions"
                      @changeText="changeText" />
                  </a>
                </td>
                <td
                  v-if="component.caret.attribute.url"
                  :width="widthCaret"
                  :valign="component.caret.attribute.valign || 'middle'"
                  :style="[
                    elementBorderAndPadding(component.caret),
                    fontStyles(component.button),
                    { width: widthStyle(widthCaret), textAlign: 'left' },
                  ]">
                  <img
                    :src="$_app.config.imageUrl + component.caret.attribute.url"
                    :bgcolor="component.caret.attribute.bgcolor"
                    :width="component.caret.attribute.width"
                    :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                    :valign="component.caret.attribute.valign || 'middle'"
                    :class="component.caret.attribute.classes || ''"
                    style="display: inline-block !important; border:0; vertical-align: baseline;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </a>
    <div v-if="applyBorderRadiusComment" class="stx-wrapper" v-html="notMsoEndingComment" />
  </ElementContainer>
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
        _.parseInt(this.component.caret.attribute.width, 10) +
          _.parseInt(this.component.caret.style.paddingLeft, 10) ||
        0 + _.parseInt(this.component.caret.style.paddingRight, 10) ||
        0
      );
    },
    notMsoStartingComment() {
      return '<!--[if !mso]><!-->';
    },
    notMsoEndingComment() {
      return '<!--<![endif]-->';
    },
    moduleHasBackgroundImage() {
      const pluginEnabled = _.get(this.module.plugins, 'backgroundStyleImageEditor.enabled');
      const hasBackgroundImage = !!_.get(this.module.plugins, 'backgroundStyleImageEditor.data.img');

      return pluginEnabled && hasBackgroundImage;
    },
    hasBorderRadius() {
      if (this.component.button.style.borderRadius) {
        const borderRadius = parseInt(this.component.button.style.borderRadius, 10);
        return borderRadius !== 0;
      }
      return false;
    },
    /**
     * Returns if button has to apply comment for outlook
     * @returns {boolean}
     */
    applyBorderRadiusComment() {
      return this.hasBorderRadius && !this.moduleHasBackgroundImage;
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
<style lang="scss" scoped>
  .stx-display-block {
    display: block;
  }
</style>
