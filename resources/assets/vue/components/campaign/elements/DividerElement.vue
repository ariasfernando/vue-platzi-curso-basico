<template>
  <!-- DIVIDER ELEMENT -->
  <module-container :component="component" @select-component="selectComponentHandler">
    <table
      width="100%"
      style="width: 100%;"
      :style="tableStyle"
      :align="component.container.attribute.align"
      border="0"
      cellpadding="0"
      cellspacing="0"
    >
      <tr>
        <td 
          :width="component.divider.attribute.width"
          :valign="component.divider.attribute.valign"
          :align="component.divider.attribute.align"
          :bgcolor="component.divider.attribute.bgcolor"
          :height="dividerHeightWithoutPx"
          style="display:block; margin:0 auto;"
          :style="innerTdStyle"
          :data-persist-styles="JSON.stringify(dataPersistStyles)"
        >&nbsp;</td>
      </tr>
    </table>
  </module-container>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin';
  import _ from 'underscore';
  
  export default {
    name: 'DividerElement',
    components: {
      ModuleContainer,
    },
    mixins: [ MobileStylesMixin, ElementMixin ],
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
      innerTdStyle() { 
        return {
          height: this.component.divider.style.height,
          lineHeight: this.component.divider.style.height,
          fontSize: this.component.divider.style.height,
          maxHeight: this.component.divider.style.height,
          backgroundColor: this.component.divider.style.borderColor,
        }  
      },
      tableStyle() {
        return {
          height: this.component.divider.style.height,
          lineHeight: this.component.divider.style.height,
          fontSize: this.component.divider.style.height,
        };
      },
      dividerHeightWithoutPx(){
        return component.divider.style.heigh.replace('px','')
      }
    },
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>
