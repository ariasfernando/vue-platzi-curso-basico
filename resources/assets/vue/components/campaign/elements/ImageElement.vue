<template>
  <module-container :component="component" @select-component="selectComponentHandler">
    <table
      :width="component.container.attribute.width || '100%'"
      :style="{width:widthStyle(component.container.attribute.width || '100%')}"
      :valign="component.container.attribute.valign || 'top'"
      :align="component.container.attribute.align || 'left'"
      border="0"
      cellpadding="0"
      cellspacing="0">
      <tr>
        <td width="100%"
            :valign="component.image.attribute.valign || 'top'"
            :align="component.image.attribute.align"
            :bgcolor="component.image.attribute.bgcolor"
            style="width:100%;"
            :style="elementBorderAndPadding(component.image)">
          <a
            :href="component.image.attribute.href"
            :alt="component.image.attribute.alt"
            :title="component.image.attribute.title"
            :target="component.image.attribute.target || '_blank'"
            @click.prevent>
            <img
              :class="{ 'st-hide-mobile' : component.image.attribute.placeholderMobile,
                        'st-resize' : mobileStretch,
                        'st-mobile-width-constraint' : !mobileStretch}"
              style="border: 0; display: block;"
              border="0"
              :valign="component.image.attribute.valign || 'top'"
              :width="imageWidth"
              :src="imageUrl(component.image.attribute.placeholder)"
              :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
              :style="{width: widthStyle(imageWidth), 'max-width': imageMaxWidth}"
              :alt="component.image.attribute.alt"
              :title="component.image.attribute.title">
            <template
              v-if="component.image.attribute.placeholderMobile">
              <div class="show-img-mobile" style="display:none;width:0;overflow:hidden;max-height:0!important;">
                <img
                  :src="imageUrl(component.image.attribute.placeholderMobile)"
                  border="0"
                  :class="{ 'st-resize' : mobileStretch,
                            'st-mobile-width-constraint' : !mobileStretch }"
                  style="display:block;border:none;max-width:100%;height:auto;"
                  :width="imageWidth"
                  :valign="component.image.attribute.valign || 'top'"
                  :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                  :style="{width: widthStyle(imageWidth), 'max-width': imageMaxWidth}"
                  :alt="component.image.attribute.alt"
                  :title="component.image.attribute.title">
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
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  import ElementMixin from '../../common/mixins/ElementMixin.js';
  import PlaceholderMixin from '../../common/mixins/PlaceholderMixin';

  export default {
    name: 'ImageElement',
    components: {
      ModuleContainer,
    },
    mixins: [MobileStylesMixin, ElementMixin, PlaceholderMixin],
    data() {
      return {
        imageUrl(imagePath) {
          if (imagePath === '' || imagePath.includes('default/')) {
            let width = this.component.image.attribute.width;
            if (width === '100%') {
              width = this.columnWidth(this.columnId);
            }
            return this.createPlaceholder(width, this.component.image.attribute.height);
          }
          return this.$_app.config.imageUrl + imagePath;
        },
      };
    },
    computed: {
      mobileStretch() {
        return this.component.image.styleOption.noMobileStretch !== true;
      },
    },
  };
</script>
