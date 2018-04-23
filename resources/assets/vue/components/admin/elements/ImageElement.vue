<template>
  <!-- IMAGE ELEMENT -->
    <tr
      data-type="image-element"
      :data-component="JSON.stringify(component)"
      :class="getMobileClasses(component,'tr')"
      @click.prevent="setComponent"
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
                  :class="{'st-hide-mobile' : component.image.styleOption.hasImageMobile}"
                  style="border: 0; display: block;"
                  border="0"
                  :width="component.image.attribute.width" 
                  :src="imageUrl(component.image.attribute.placeholder)"
                  :height="component.image.attribute.height"
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
                      :height="component.image.attribute.height"
                      :alt="component.image.attribute.alt"
                      :title="component.image.attribute.title"
                    />
                  </div>
                </template>
              </a>
              <component-toolbar :component-id="componentId" :column-id="columnId"></component-toolbar>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ComponentAttributeMixin from '../../common/mixins/ComponentAttributeMixin.js';
  
  export default {
    name: 'ImageElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    components: {
      ComponentToolbar,
    },
    mixins: [ MobileStylesMixin, ComponentAttributeMixin ],
    data(){
      return {
        imageUrl(imagePath) {
          return this.$_app.config.imageUrl + imagePath;
        }
      }
    },
    computed: {
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
    }
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .stx-position-relative{
    position: relative;
  }
</style>
