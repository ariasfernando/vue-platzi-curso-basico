<template>
  <!-- DIVIDER ELEMENT -->
  <tr 
    @click="selectComponent"
    data-type="image-element"
    :class="getMobileClasses(component,'tr')"
  >
    <td 
      :width="component.container.attribute.width"
      :style="stylesContainer"
      style=" verticalAlign: middle; margin: 0; width: 100%;"
      :align="component.container.attribute.align || 'top'"
      class="stx-position-relative"
      :bgcolor="component.container.attribute.bgcolor"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
    >
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
            :height="component.divider.style.height"
            style="display:block; margin:0 auto;"
            :style="innerTdStyle"
            :data-persist-styles="JSON.stringify(dataPersistStyles)"
          >&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</template>

<script>
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
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
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
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
      stylesContainer(){
        let stylesContainer = {};

        _.each(this.component.container.style, (value, key) => {
           if (key.indexOf('padding') >= 0 || key.indexOf('border') >= 0){
              stylesContainer[key]= value;
           }
        });
        stylesContainer['width'] = this.widthStyle(this.component.container.attribute.width || "100%");

        return stylesContainer;
      },
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
    },
    methods: {
      widthStyle(width) {
        return _.endsWith(width, "%") ? width : width + "px";
      },
      selectComponent() {
        this.$emit("select-component", {
            moduleId:this.moduleId,
            columnId:this.columnId,
            componentId:this.componentId
        });
      }
    },
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>
