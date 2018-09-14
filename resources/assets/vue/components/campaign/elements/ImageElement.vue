<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <table
      width="100%"
      style="width: 100%;"
      :valign="component.container.attribute.valign || 'top'"
      border="0"
      cellpadding="0"
      cellspacing="0"
    >
      <tr>
        <td 
          width="100%"
          :valign="component.image.attribute.valign || 'top'"
          :align="component.image.attribute.align"
          :bgcolor="component.image.attribute.bgcolor"
          style="width:100%;"
          :style="elementBorderAndPadding(component.image)"
        >
          <a
            @click.prevent
            :href="component.image.attribute.href"
            :alt="component.image.attribute.alt"
            :title="component.image.attribute.title"
            :target="component.image.attribute.target"
            >
            <img
              :class="{ 'st-hide-mobile' : component.image.attribute.placeholderMobile,
                        'st-resize' : mobileStretch,
                        'st-mobile-width-constraint' : !mobileStretch }"
              style="border: 0; display: block;"
              border="0"
              :valign="component.image.attribute.valign || 'top'"
              :width="component.image.attribute.width"
              :src="this.$_app.config.imageUrl + component.image.attribute.placeholder"
              :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
              :style="{width:widthStyle(component.image.attribute.width)}"
              :alt="component.image.attribute.alt"
              :title="component.image.attribute.title"
            >
            <template
              v-if="component.image.attribute.placeholderMobile">
              <div class="show-img-mobile" style="display:none;width:0;overflow:hidden;max-height:0!important;">
                <img
                  :src="this.$_app.config.imageUrl + component.image.attribute.placeholderMobile"
                  border="0"
                  :class="{ 'st-resize' : mobileStretch,
                            'st-mobile-width-constraint' : !mobileStretch }"
                  style="display:block;border:none;max-width:100%;height:auto;"
                  :width="component.image.attribute.width"
                  :valign="component.image.attribute.valign || 'top'"
                  :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                  :style="{width:widthStyle(component.image.attribute.width)}"
                  :alt="component.image.attribute.alt"
                  :title="component.image.attribute.title"
                />
              </div>
            </template>
          </a>
        </td>
      </tr>
    </table>
  </module-container>
<!-- IMAGE ELEMENT ENDS -->
</template>


<script>
  import _ from 'lodash';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  
  export default {
    name: 'ImageElement',
    components: {
      ModuleContainer,
    },
    mixins: [ MobileStylesMixin, ElementMixin],
    computed: {
      containerImageWidth(){
        let paddingLeft = _.parseInt(this.component.image.style.paddingLeft) || 0
        let paddingRight = _.parseInt(this.component.image.style.paddingRight) || 0
        return _.parseInt(this.component.image.attribute.width) - paddingLeft - paddingRight ;
      },
      mobileStretch() {
        return this.component.image.styleOption.noMobileStretch !== true;
      }
    },
  };
</script>
