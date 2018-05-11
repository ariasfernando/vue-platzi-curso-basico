<template>
  <!-- DIVIDER ELEMENT -->
  <tr 
    data-type="divider-element"
    :data-component="JSON.stringify(component)"
    :class="getMobileClasses(component,'tr')"
    @click.prevent="setComponent"
  >
    <td 
      :width="component.container.attribute.width"
      :style="stylesContainer"
      style="verticalAlign: middle; margin: 0; width: 100%;"
      :align="component.container.attribute.align || 'top'"
      class="stx-position-relative"
      :bgcolor="component.container.attribute.bgcolor"
      :class="[getMobileClasses(component,'td:first'), getAttributeClasses(component)]"
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="width: 100%;"
        :style="tableStyle"
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
            >&nbsp;</td>
        </tr>
      </table>
      <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
    </td>
  </tr>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin';
  
  export default {
    name: 'DividerElement',
    components: {
      ComponentToolbar
    },
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
    data(){
      return{
        defaultFirstTdStyle: {
          verticalAlign: 'middle',
          margin: 0,
          width: '100%'
        },
        defaultInnerTdStyle: {
          display:'block',
          margin:'0 auto'
        }
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
          backgroundColor: this.component.divider.attribute.bgcolor,
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
      setComponent(e) {
        if (!$(e.target).hasClass("st-remove")){
          this.$store.commit("module/setCurrentComponent", {
            columnId: this.columnId,
            componentId: this.componentId
          });
        }  
      },
    },
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .st-divider {
    width: 100%;
    border: none;
  }

  .stx-position-relative{
    position: relative;
  }

  .stx-line-height-reset{
    line-height: 0;
  }
</style>
