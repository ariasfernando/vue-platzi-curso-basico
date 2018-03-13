<template>
  <!-- IMAGE ELEMENT -->
  <table 
    width="100%" 
    cellpadding="0" 
    cellspacing="0" 
    border="0"
    style="width: 100%;"
  >
    <tr 
      data-type="image-element"
      :class="getMobileClasses(component,'tr')"
    >
      <td 
        width="100%" 
        align="center"
        class="stx-position-relative"
        :style="component.style"
        :bgcolor="component.attribute.bgcolor"
        :class="getMobileClasses(component,'td:first')"
      >
        <table 
          width="100%" 
          cellspacing="0" 
          cellpadding="0" 
          border="0"
          style="width: 100%;"
        >
          <tr>
            <td 
              width="100%" 
              style="width: 100%;"
              :align="component.attribute.align" 
              :valign="component.attribute.valign"
            >
              <a 
                @click.prevent
                :href="component.attribute.href"
                :alt="component.attribute.alt"
                :title="component.attribute.title"
                :target="component.attribute.target"
              >
                <img
                  class="st-resize"
                  style="border: 0; display: block;"
                  border="0"
                  :src="imageUrl(component.attribute.placeholder)"
                  :width="component.attribute.width" 
                  :height="component.attribute.height"
                  :alt="component.attribute.alt"
                  :title="component.attribute.title"
                >
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';

  export default {
    name: 'ImageElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component',
      'number-required',
      'column-width',
      'column'
    ],
    mixins: [ MobileStylesMixin ],
    created () {
      this.setupModule();
      if(this.numberRequired) {
        let tempWidth = _.toString(this.component.attribute.width);
        let paddingLeft = _.parseInt(this.component.style.paddingLeft.replace(/px$/, ''));
        let paddingRight = _.parseInt(this.component.style.paddingRight.replace(/px$/, ''));
        let paddingColumLeft = _.parseInt(this.column.style.paddingLeft.replace(/px$/, ''));
        let paddingColumRight = _.parseInt(this.column.style.paddingRight.replace(/px$/, ''));
        
        if ( tempWidth.indexOf('%') > 1){

          let widthPercent = _.parseInt(tempWidth.replace(/%$/, ''));
          tempWidth = this.columnWidth * widthPercent / 100;
        }else if ( tempWidth.indexOf('px') > 1){
          tempWidth = _.parseInt(tempWidth.replace(/px$/, ''));
        }
        
        const payload = {
          moduleId: this.moduleId,
          columnId: this.columnId,
          componentId: 0,
          attribute: 'width',
          attributeValue: ( tempWidth - (paddingLeft + paddingRight) - (paddingColumLeft + paddingColumRight)),
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
    data(){
      return {
        imageUrl(imagePath) {
          return this.$_app.config.imageUrl + imagePath;
        }
      }
    },
    methods: {
      setupModule () {
        this.elementConfig = null;

        if (this.component.directives && this.component.directives.elementConfig) {
          this.elementConfig = this.component.directives.elementConfig;
        }
      },
    }
  };
</script>