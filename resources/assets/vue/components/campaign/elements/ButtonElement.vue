<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr
    @click="selectComponent"
    data-type="button-element"
    :class="getMobileClasses(component,'tr')"
  >
    <td
      class="stx-position-relative"
      width="100%"
      style="width: 100%;"
      :style="component.container.style"
      :align="component.container.attribute.align"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
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
                    :valign="component.button.attribute.valign || 'middle'"
                    >
                    <div
                        class="stx-edit-text stx-wrapper"
                        style="display: inline-block !important; vertical-align: middle"
                        :style="buttonFontStyles"
                        v-html="content"
                        :id="editorId"
                        @keyup="changeContent"
                        @tiny-change="changeContent"
                        @input="changeContent"
                      >
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
                      :height="component.caret.attribute.height === 'auto' ? undefined : component.caret.attribute.height"
                      :valign="component.caret.attribute.valign || 'middle'"
                      :class="component.caret.attribute.classes || ''"
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
  <!-- CTA ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
  import TinyMixin from '../mixins/TinyMixin.js';
  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    mixins: [ MobileStylesMixin, ComponentAttributeMixin, TinyMixin ],
    data() {
      return {    
        content: this.component.data.text,
        timer: null
      };
    },
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    mounted(){
      const changeStyles = (selector, styles) => {
        let editorLinks = $(`#${this.editorId}`).find(selector);
        if(editorLinks.length){
          for (var i = 0; i < editorLinks.length; i++) {
            $(editorLinks[i]).css(styles);
          }
        }
      }
      changeStyles('p', { color: this.component.button.style.color || this.libraryConfig.linkColor });
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      editorId(){
        return ["editor", this.module.idInstance, this.columnId, this.componentId].join("-");
      },
      libraryConfig(){
        return this.$store.state.campaign.campaign.library_config;
      },
      buttonBorderAndPadding(){
        return{
          'padding-top':this.component.button.style.paddingTop,
          'padding-bottom':this.component.button.style.paddingBottom,
          'padding-right':this.component.button.style.paddingRight,
          'padding-left':this.component.button.style.paddingLeft,
          'border-top-width':this.component.button.style.borderTopWidth,
          'border-right-width':this.component.button.style.borderRightWidth,
          'border-bottom-width':this.component.button.style.borderBottomWidth,
          'border-left-width':this.component.button.style.borderLeftWidth,
          'border-top-style':this.component.button.style.borderTopStyle,
          'border-right-style':this.component.button.style.borderRightStyle,
          'border-bottom-style':this.component.button.style.borderBottomStyle,
          'border-left-style':this.component.button.style.borderLeftStyle,
          'border-top-color':this.component.button.style.borderTopColor,
          'border-right-color':this.component.button.style.borderRightColor,
          'border-bottom-color':this.component.button.style.borderBottomColor,
          'border-left-color':this.component.button.style.borderLeftColor
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
          'line-height':this.component.button.style.lineHeight,
        }
      },
      caretPaddingAndWidth() {
        return {
          'padding-top':this.component.caret.style.paddingTop,
          'padding-bottom':this.component.caret.style.paddingBottom,
          'padding-right':this.component.caret.style.paddingRight,
          'padding-left':this.component.caret.style.paddingLeft,
          'width': this.widthCaret + 'px'
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      },
    },
    methods: {
      selectComponent() {
        this.$emit("select-component", {
            moduleId: this.moduleId,
            columnId: this.columnId,
            componentId: this.componentId
        });
      },
      changeContent(e) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.$store.commit('campaign/updateElement', {
            moduleId:this.moduleId,
            columnId:this.columnId,
              componentId:this.componentId,
              data: {
                text: e.target.innerHTML
              }
            });
          }, 500);
        },  
      },
    };
</script>
<style lang="less">
  .st-unlink {
    cursor: default;
  }
  .mce-menu-item-preview {
    .mce-text {
      font-size: 14px !important;
    }
  }
  // hidde the sub menu of Numbered list and Bullet list
  div[aria-label="Numbered list"],
  div[aria-label="Bullet list"]{
    button.mce-open{
      display: none;
    }
  }
</style>
