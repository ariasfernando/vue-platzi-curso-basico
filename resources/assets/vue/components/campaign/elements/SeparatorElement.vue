<template>
  <!-- DIVIDER ELEMENT -->
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="width: 100%;">
    <tr 
      data-type="separator-element"
      :class="getMobileClasses(component,'tr')"
    >
      <td
        class="stx-position-relative" 
        width="100%"
        align="center"
        :height="heightAsInt"
        :bgcolor="component.attribute.bgcolor" 
        :style="[defaultFirstTdStyle, firstTdStyle]"
        :class="getMobileClasses(component,'td:first')"
      >
        <table 
          width="100%"
          cellpadding="0" 
          cellspacing="0" 
          border="0" 
          style="width:100%;width:100%!important;"
          :style="tableStyle"
        >
          <tbody>
            <tr>
              <td
                :bgcolor="component.style.borderColor" 
                :height="heightAsInt"
                :style="[defaultInnerTdStyle, innerTdStyle]"
                :data-persist-styles="JSON.stringify(dataPersistStyles)"
              >&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import _ from 'lodash';

  export default {
    name: 'SeparatorElement',
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
        defaultFirstTdStyle: {
          verticalAlign: 'middle',
          margin: 0,
          width: '100%'
        },
        defaultInnerTdStyle: {
          display:'block',
          margin:'0 auto',
        },
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
      firstTdStyle() {
        let padding = {};
        
        _.each(this.component.style, (value, key) => {
           if (key.indexOf('padding') >= 0 ){
              padding[key]= value;
           }
        });

        return padding;
      },
      innerTdStyle() { 
        let widthTemplate = 640;
        return {
          maxWidth: widthTemplate - (_.parseInt(this.component.style.paddingRight) + _.parseInt(this.component.style.paddingLeft)) + 'px', 
          height: this.component.style.height,
          lineHeight: this.component.style.height,
          fontSize: this.component.style.height,
          maxHeight: this.component.style.height,
          backgroundColor: this.component.style.borderColor,
        }  
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
      },
    }
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>