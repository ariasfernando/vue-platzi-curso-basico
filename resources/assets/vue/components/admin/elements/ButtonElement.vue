<template>
  <!-- CALL TO ACTION ELEMENT -->
  <tr
    data-type="button-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr')"
    @click.prevent="setComponent"
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
        :href="component.button.attribute.href || ''"
        :target="component.button.attribute.target || '_blank'"
        :style="component.button.style.textDecoration || 'text-decoration:none;'"
        @click.prevent
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
                    :valign="component.button.attribute.valign || ''"
                    >
                    <tiny-mce :style="buttonFontStyles" :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
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
                        :valign="component.button.attribute.valign || 'middle'"
                        style="display: inline-block !important; border:0;"
                      >
                  </td>
                </tr>
              </table>
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
  <!-- CALL TO ACTION ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';

  import _ from 'lodash';

  export default {
    name: 'ButtonElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      'tiny-mce': TinyMCE,
      ComponentToolbar,
    },
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
    data(){
      return {
        editorId: ['editor', this.columnId, this.componentId].join('-')
      }
    },
    computed:{
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
          'width': this.widthCaret +'px'
        }
      },
      widthCaret() {
        return _.parseInt(this.component.caret.attribute.width) + _.parseInt(this.component.caret.style.paddingLeft) || 0 + _.parseInt(this.component.caret.style.paddingRight) || 0;
      }
    },
    methods: {
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });
        }
      },
    mounted() {
      const subcomponents = ['text', 'content', 'container', 'image'];
      subcomponents.forEach((subcomponent) => {
        const propertys = ['attribute', 'style', 'styleOption'];
        const thisSubcomponent = subcomponent;
        propertys.forEach((property) => {
          if (this.component && this.component[thisSubcomponent] && Array.isArray(this.component[thisSubcomponent][property])) {
            const data = {
              columnId: this.columnId,
              componentId: this.componentId,
              subComponent: thisSubcomponent,
              property,
              value: new Object,
            };
            this.$store.commit('module/saveComponentProperty', data);
          }
        });
      });
    },
    }
  }
</script>

<style lang="less">
  @icon-option: #69dac8;

  .stx-position-relative{
    position: relative;
  }

  .st-cta {
    td {
      vertical-align: middle;
      a {
        text-decoration: none;
        display: block;
      }
    }
  }
</style>
