<template>
  <!-- TEXT ELEMENT -->
  <tr
    data-type="text-element"
    :class="getMobileClasses(component,'tr') + component.container.attribute.classes || ''"
  >
    <td
      width="100%"
      style="width: 100%;"
      :class="getMobileClasses(component,'td:first')"
      :style="component.container.style"
      :align="component.container.attribute.align"
      :bgcolor="component.container.attribute.bgcolor"
    >
      <table
        width="100%"
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="width: 100%;"
      >
        <tr>
          <td
            width="100%"
            style="vertical-align: middle; width:100%;"
            class="stx-position-relative"
            :align="component.text.attribute.align"
            :bgcolor="component.text.attribute.bgcolor"
            :style="[textFontStyles, textBorderAndPadding]"
          >
            <div class="stx-edit-text stx-wrapper" :id="editorId" v-html="component.data.text"></div>
            <div :class="'st-remove-element stx-toolbar toolbar-'+editorId"></div>
          </td>
        </tr> 
      </table>     
    </td>
  </tr>
  <!-- TEXT ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import _ from 'lodash';

  export default {
    name: 'TextElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    mixins: [ MobileStylesMixin ],
    data(){
      return {
        editorId: ['editor', this.moduleId, this.columnId, this.componentId].join('-'),
        toolbar: ' ',
        fixed: false,
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
  };
</script>
