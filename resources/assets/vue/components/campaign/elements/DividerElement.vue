<template>
  <!-- DIVIDER ELEMENT -->
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="width:100%;"
    :style="tableStyle"
  >
    <tr 
      data-type="divider-element"
      :class="getMobileClasses(component,'tr') + component.attribute.classes.join(' ')"
    >
      <td
        class="stx-position-relative stx-line-height-reset"
        :bgcolor="component.style.backgroundColor"
        :height="heightAsInt"
        :width="component.style.width || '100%'"
        :style="styles"
        :class="getMobileClasses(component,'td:first')"
        :data-persist-styles="JSON.stringify(dataPersistStyles)"
      >&nbsp;</td>
    </tr>
  </table>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import _ from 'lodash';

  export default {
    name: 'DividerElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'column'
    ],
    mixins: [ MobileStylesMixin ],
    data(){
      return{
        dataPersistStyles: {
          '-webkit-text-size-adjust':'100%',
          '-ms-text-size-adjust':'100%',
          'mso-line-height-rule':'exactly',
          'mso-table-lspace':'0pt',
          'mso-table-rspace':'0pt'
        },
      }
    },
    computed: {
      styles(){
        let inlineStyle = `height:${this.component.style.height};
                          width:${this.component.style.width };
                          border-top-width:${this.component.style.borderTopWidth};  
                          border-right-width:${this.component.style.borderRightWidth};
                          border-bottom-width:${this.component.style.borderBottomWidth};
                          border-left-width:${this.component.style.borderLeftWidth};
                          border-top-style:${this.component.style.borderTopStyle};
                          border-right-style:${this.component.style.borderRightStyle};
                          border-bottom-style:${this.component.style.borderBottomStyle};
                          border-left-style:${this.component.style.borderLeftStyle};
                          border-top-color:${this.component.style.borderTopColor};
                          border-right-color:${this.component.style.borderRightColor};
                          border-bottom-color:${this.component.style.borderBottomColor};
                          border-left-color:${this.component.style.borderLeftColor};`;

        return inlineStyle;
      },
      tableStyle() {
        return {
          height: this.component.style.height,
          lineHeight: this.component.style.height,
          fontSize: this.component.style.height,
        };
      },
      heightAsInt() {
        return _.parseInt(this.component.style.height);
      }
    }
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>
