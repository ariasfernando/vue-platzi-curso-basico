<template>
  <!-- IMAGE ELEMENT -->
  <tr 
    @click="selectComponent"
    data-type="image-element"
    :class="getMobileClasses(component,'tr')"
  >
    <td 
      :width="component.container.attribute.width || containerImageWidth"
      :style="[containerBorderAndPadding,{'width':widthStyle(component.container.attribute.width || containerImageWidth)}]"
      :align="component.container.attribute.align || 'top'"
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
            :style="[imageBorderAndPadding,{'width':widthStyle(component.image.attribute.width)}]"
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
                  :class="{'st-hide-mobile' : component.image.styleOption.hasImageMobile}"
                  style="border: 0; display: block;"
                  border="0"
                  :width="component.image.attribute.width" 
                  :src="imageUrl(component.image.attribute.placeholder)"
                  :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                  :alt="component.image.attribute.alt"
                  :title="component.image.attribute.title"
                >
                <template 
                  v-if="component.image.styleOption.hasImageMobile">
                  <div class="show-img-mobile" style="display:none;width:0;overflow:hidden;max-height:0!important;">
                    <img
                      :src="imageUrl(component.image.attribute.placeholderMobile)"
                      border="0"
                      class="st-resize"
                      style="display:block;border:none;max-width:100%;height:auto;"
                      :width="component.image.attribute.width" 
                      :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                      :alt="component.image.attribute.alt"
                      :title="component.image.attribute.title"
                    />
                  </div>
                </template>
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
      'column-width',
      'column'
    ],
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
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
      },
      containerImageWidth(){
        let paddingLeft = _.parseInt(this.component.image.style.paddingLeft) || 0
        let paddingRight = _.parseInt(this.component.image.style.paddingRight) || 0
        return _.parseInt(this.component.image.attribute.width) - paddingLeft - paddingRight ;
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
    }
  };
</script>
