<template>
  <!-- IMAGE ELEMENT -->
  <tr 
    data-type="image-element"
    :class="[getMobileClasses(component,'tr'), getAttributeClasses(component)]"
  >
    <td 
      :width="component.container.attribute.width"
      :style="[containerBorderAndPadding, widthStyle(component.container.attribute.width)]"
      :align="component.container.attribute.align"
      class="stx-position-relative"
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
            :width="component.image.attribute.width"
            :valign="component.image.attribute.valign"
            :align="component.image.attribute.align"
            :bgcolor="component.image.attribute.bgcolor"
            :style="[imageBorderAndPadding,{width:widthStyle(component.image.attribute.width)}]"
          >
            <a 
              @click.prevent
              :href="component.image.attribute.href"
              :alt="component.image.attribute.alt"
              :title="component.image.attribute.title"
              :target="component.image.attribute.target"
            >
              <img
                class="st-resize"
                style="border: 0; display: block;"
                border="0"
                :src="imageUrl(component.image.attribute.placeholder)"
                :width="component.image.attribute.width" 
                :height="component.image.attribute.height"
                :alt="component.image.attribute.alt"
                :title="component.image.attribute.title"
              >
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';

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
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
    created () {
      this.setupModule();
      if(this.numberRequired) {
        let tempWidth = _.toString(this.component.attribute.width);
        let paddingLeft = _.parseInt(this.component.style.paddingLeft.replace(/px$/, ''));
        let paddingRight = _.parseInt(this.component.style.paddingRight.replace(/px$/, ''));
        let paddingColumLeft = _.parseInt(this.column.container.style.paddingLeft.replace(/px$/, ''));
        let paddingColumRight = _.parseInt(this.column.container.style.paddingRight.replace(/px$/, ''));
        
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
    computed:{
      imageBorderAndPadding() {
        return [
          {"padding-top": this.component.image.style.paddingTop},
          {"padding-bottom": this.component.image.style.paddingBottom},
          {"padding-right": this.component.image.style.paddingRight},
          {"padding-left": this.component.image.style.paddingLeft},
          {"border-top-width": this.component.image.style.borderTopWidth},
          {"border-right-width": this.component.image.style.borderRightWidth},
          {"border-bottom-width": this.component.image.style.borderBottomWidth},
          {"border-left-width": this.component.image.style.borderLeftWidth},
          {"border-top-style": this.component.image.style.borderTopStyle},
          {"border-right-style": this.component.image.style.borderRightStyle},
          {"border-bottom-style": this.component.image.style.borderBottomStyle},
          {"border-left-style": this.component.image.style.borderLeftStyle},
          {"border-top-color": this.component.image.style.borderTopColor},
          {"border-right-color": this.component.image.style.borderRightColor},
          {"border-bottom-color": this.component.image.style.borderBottomColor},
          {"border-left-color": this.component.image.style.borderLeftColor}
        ];
      },
      containerBorderAndPadding() {
        return [
          {"padding-top": this.component.container.style.paddingTop},
          {"padding-bottom": this.component.container.style.paddingBottom},
          {"padding-right": this.component.container.style.paddingRight},
          {"padding-left": this.component.container.style.paddingLeft},
          {"border-top-width": this.component.container.style.borderTopWidth},
          {"border-right-width": this.component.container.style.borderRightWidth},
          {"border-bottom-width": this.component.container.style.borderBottomWidth},
          {"border-left-width": this.component.container.style.borderLeftWidth},
          {"border-top-style": this.component.container.style.borderTopStyle},
          {"border-right-style": this.component.container.style.borderRightStyle},
          {"border-bottom-style": this.component.container.style.borderBottomStyle},
          {"border-left-style": this.component.container.style.borderLeftStyle},
          {"border-top-color": this.component.container.style.borderTopColor},
          {"border-right-color": this.component.container.style.borderRightColor},
          {"border-bottom-color": this.component.container.style.borderBottomColor},
          {"border-left-color": this.component.container.style.borderLeftColor}
        ];
      }
    },
    methods: {
      setupModule () {
        this.elementConfig = null;

        if (this.component.directives && this.component.directives.elementConfig) {
          this.elementConfig = this.component.directives.elementConfig;
        }
      },
      widthStyle(width) {
        return _.endsWith(width, "%") ? width : width + "px";
      },
    }
  };
</script>
