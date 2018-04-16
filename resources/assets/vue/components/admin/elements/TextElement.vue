<template>
  <!-- TEXT ELEMENT -->
  <tr 
    data-type="text-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr') + component.container.attribute.classes || ''"
    @click.prevent="setComponent"
  >
    <td
      width="100%"
      style="width: 100%;"
      :style="component.container.style"
      :align="component.container.attribute.align"
      :bgcolor="component.container.attribute.bgcolor"
      :class="getMobileClasses(component,'td:first')"
    >
      <table 
        cellpadding="0" 
        cellspacing="0" 
        width="100%" 
        border="0" 
        align="center" 
        style="width: 100%;"
      >
        <tr>
          <td
            width="100%" 
            style="vertical-align: middle; width:100%;"
            class="stx-edit-text stx-position-relative" 
            :align="component.text.attribute.align"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[textFontStyles, textBorderAndPadding]"
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
    mixins: [ MobileStylesMixin ],
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
    }
  };
</script>

<style lang="less">
  .stx-position-relative{
    position: relative;
  }

  .stx-edit-text{
    p{
      margin: 0;
      padding: 0;
    }
  }
</style>
