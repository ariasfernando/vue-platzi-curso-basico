<template>
  <!-- TEXT ELEMENT -->
  <tr 
    data-type="text-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr')"
    @click.prevent="setComponent"
  >
    <td
      :width="component.container.attribute.width||'100%'"
      :style="[containerBorderAndPadding, widthContainer]"
      :align="component.container.attribute.align || 'center'"
      :bgcolor="component.container.attribute.bgcolor"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
    >
      <table
        width="100%"
        style="width: 100%;"
        :align="component.container.attribute.align"
        border="0"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>
          <td
            style="vertical-align: middle; width:100%;"
            class="stx-edit-text stx-position-relative"
            :width="component.text.attribute.width"
            :valign="component.text.attribute.valign || 'top'"
            :align="component.text.attribute.align"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[textFontStyles, textBorderAndPadding,{width:widthStyle(component.text.attribute.width)}]"
          >
            <tiny-mce :style="textFontStyles" :id="editorId" :value="component.data.text" data-key="text" :settings="component.plugins.textOptions.config.settings"></tiny-mce>
            <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
          </td>
        </tr> 
      </table>     
    </td> 
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import TinyMCE from './TinyMce.vue';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
  import _ from 'lodash';

  export default {
    name: 'TextElement',
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
        editorId: ['editor', this.columnId, this.componentId].join('-'),
        dirty: false
      }
    },
    computed:{
      textFontStyles() {
        return {
          'text-align':this.component.text.style.textAlign,
          'font-family':this.component.text.style.fontFamily,
          'color':this.component.text.style.color,
          'font-size':this.component.text.style.fontSize,
          'font-weight':this.component.text.style.fontWeight,
          'letter-spacing':this.component.text.style.letterSpacing,
          'line-height':this.component.text.style.lineHeight,
        }
      },
      textBorderAndPadding(){
        return{
          'padding-top':this.component.text.style.paddingTop,
          'padding-bottom':this.component.text.style.paddingBottom,
          'padding-right':this.component.text.style.paddingRight,
          'padding-left':this.component.text.style.paddingLeft,
          'border-top-width':this.component.text.style.borderTopWidth,
          'border-right-width':this.component.text.style.borderRightWidth,
          'border-bottom-width':this.component.text.style.borderBottomWidth,
          'border-left-width':this.component.text.style.borderLeftWidth,
          'border-top-style':this.component.text.style.borderTopStyle,
          'border-right-style':this.component.text.style.borderRightStyle,
          'border-bottom-style':this.component.text.style.borderBottomStyle,
          'border-left-style':this.component.text.style.borderLeftStyle,
          'border-top-color':this.component.text.style.borderTopColor,
          'border-right-color':this.component.text.style.borderRightColor,
          'border-bottom-color':this.component.text.style.borderBottomColor,
          'border-left-color':this.component.text.style.borderLeftColor
        }
      },
      containerBorderAndPadding() {
        return {
          "padding-top": this.component.container.style.paddingTop,
          "padding-bottom": this.component.container.style.paddingBottom,
          "padding-right": this.component.container.style.paddingRight,
          "padding-left": this.component.container.style.paddingLeft,
          "border-top-width": this.component.container.style.borderTopWidth,
          "border-right-width": this.component.container.style.borderRightWidth,
          "border-bottom-width": this.component.container.style.borderBottomWidth,
          "border-left-width": this.component.container.style.borderLeftWidth,
          "border-top-style": this.component.container.style.borderTopStyle,
          "border-right-style": this.component.container.style.borderRightStyle,
          "border-bottom-style": this.component.container.style.borderBottomStyle,
          "border-left-style": this.component.container.style.borderLeftStyle,
          "border-top-color": this.component.container.style.borderTopColor,
          "border-right-color": this.component.container.style.borderRightColor,
          "border-bottom-color": this.component.container.style.borderBottomColor,
          "border-left-color": this.component.container.style.borderLeftColor
        };
      },
      widthContainer() {
        return {
          width: this.component.container.attribute.width
            ? this.widthStyle(this.component.container.attribute.width)
            : "100%"
        };
      }
    },
    methods: {
      widthStyle(width) {
        return _.endsWith(width, "%") ? width : width + "px";
      },
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });
        }  
      },
    }
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
