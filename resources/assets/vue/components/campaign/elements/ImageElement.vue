<template>
  <element-container :component="component" @select-component="selectComponentHandler">
    <table
      :width="component.container.attribute.width || '100%'"
      :style="{width:widthStyle(component.container.attribute.width || '100%')}"
      :valign="component.container.attribute.valign || 'top'"
      :align="component.container.attribute.align || 'left'"
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
            :target="component.image.attribute.target || '_blank'"
            >
            <img
              :class="{ 'st-hide-mobile' : component.image.attribute.placeholderMobile,
                        'st-resize' : mobileStretch,
                        'st-mobile-width-constraint' : !mobileStretch,
                        'stx-max-width-full' : true }"
              style="border: 0; display: block;"
              border="0"
              :valign="component.image.attribute.valign || 'top'"
              :width="imageWidth"
              :src="this.$_app.config.imageUrl + component.image.attribute.placeholder"
              :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
              :style="{width: widthStyle(imageWidth)}"
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
                  :width="imageWidth"
                  :valign="component.image.attribute.valign || 'top'"
                  :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                  :style="{width: widthStyle(imageWidth)}"
                  :alt="component.image.attribute.alt"
                  :title="component.image.attribute.title"
                />
              </div>
            </template>
          </a>
        </td>
      </tr>
    </table>
  </element-container>
<!-- IMAGE ELEMENT ENDS -->
</template>


<script>
  import _ from 'lodash';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementContainer from '../../common/containers/ElementContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  
  export default {
    name: 'ImageElement',
    components: {
      ElementContainer,
    },
    mixins: [ MobileStylesMixin, ElementMixin],
    computed: {
      mobileStretch() {
        return this.component.image.styleOption.noMobileStretch !== true;
      }
    },
  };
</script>
