<template>
  <!-- CALL TO ACTION ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr
      data-type="button-element"
      :class="getMobileClasses(component,'tr') + getAttributeClasses(component)"
    >
      <td
        class="stx-position-relative"
        width="100%"
        style="width: 100%;"
        :style="component.container.style"
        :align="component.container.attribute.align"
        :class="getMobileClasses(component,'td:first')"
      >
        <a
          @click.prevent
          :href="component.button.attribute.href || ''"
          :target="component.button.attribute.target || '_blank'"
          :style="component.button.style.textDecoration || 'text-decoration:none;'"
        >
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            :width="component.button.attribute.width"
            :height="component.button.attribute.height"
            :bgcolor="component.button.attribute.bgcolor"
            :style="`width:${component.button.attribute.width}px`"
          >
            <tr>
              <td
                width="100%"
                :bgcolor="component.button.attribute.bgcolor"
                :height="component.button.attribute.height"
                style="vertical-align: middle; width:100%;"
                :style="buttonBorderAndPadding"
              >
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="width:100%"
                >
                  <tr>
                    <td
                      width="100%"
                      :align="component.button.attribute.align"
                      :style="buttonFontStyles"
                      :valign="component.button.attribute.valign"
                      >
                      <div
                          class="stx-edit-text stx-wrapper"
                          style="display: inline-block !important; vertical-align: middle"
                          v-html="setColorContent(component.data.text, styles.color)"
                          :id="editorId" >
                      </div>
                    </td>
                    <td
                      v-if="component.caret.attribute.url"
                      :width="widthCaret"
                      :style="caretPaddingAndWidth"
                    >
                      <img
                        :src="$_app.config.imageUrl + component.caret.attribute.url"
                        :bgcolor="component.caret.attribute.bgcolor"
                        :width="component.caret.attribute.width"
                        :height="component.caret.attribute.height"
                        :valign="component.button.attribute.valign"
                        :class="component.caret.attribute.classes"
                        style="display: inline-block !important; border:0;"
                      >
                    </td>
                  </tr>
                </table>
                <div class="st-remove-element stx-toolbar" :class="`toolbar-${editorId}`"></div>
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>
  </table>
  <!-- CTA ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
      }
    },
    computed: {
      buttonBorderAndPadding(){
        return{
          'padding-top':component.button.style.paddingTop,
          'padding-bottom':component.button.style.paddingBottom,
          'padding-right':component.button.style.paddingRight,
          'padding-left':component.button.style.paddingLeft,
          'border-top-width':component.button.style.borderTopWidth,
          'border-right-width':component.button.style.borderRightWidth,
          'border-bottom-width':component.button.style.borderBottomWidth,
          'border-left-width':component.button.style.borderLeftWidth,
          'border-top-style':component.button.style.borderTopStyle,
          'border-right-style':component.button.style.borderRightStyle,
          'border-bottom-style':component.button.style.borderBottomStyle,
          'border-left-style':component.button.style.borderLeftStyle,
          'border-top-color':component.button.style.borderTopColor,
          'border-right-color':component.button.style.borderRightColor,
          'border-bottom-color':component.button.style.borderBottomColor,
          'border-left-color':component.button.style.borderLeftColor
        }
      },
      buttonFontStyles() {
        return {
          'text-align':this.component.button.style.textAlign,
          'font-family':this.component.button.style.fontFamily,
          'color':this.component.button.style.color,
          'font-size':this.component.button.style.fontSize,
          'font-weight':this.component.button.style.fontWeight,
          'letter-spacing':this.component.button.style.letterSpacing,
          'line-height':this.component.button.style.lineHeigh,
        }
      },
      caretPaddingAndWidth() {
        return {
          'padding-top':component.caret.style.paddingTop,
          'padding-bottom':component.caret.style.paddingBottom,
          'padding-right':component.caret.style.paddingRight,
          'padding-left':component.caret.style.paddingLeft,
          'width': this.widthCaret + 'px'
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      }
    },
    mixins: [ MobileStylesMixin ],
    methods: {
      setColorContent(text, color) {
        return text.replace("<p>", `<p style='color:${color || inherit} !important'>`);
      }
    }
  };
</script>

<style>
  .st-unlink {
    cursor: default;
  }

</style>
