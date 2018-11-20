<template>
  <module-container :component="component" :is-active="isActive" @select-component="selectComponentHandler">
    <table
      :width="component.container.attribute.width || '100%'"
      :style="{width:widthStyle(component.container.attribute.width || '100%')}"
      :valign="component.container.attribute.valign || 'top'"
      :align="component.container.attribute.align || 'left'"
      border="0"
      cellpadding="0"
      cellspacing="0">
      <tr>
        <td
          width="100%"
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
                        'st-mobile-width-constraint' : !mobileStretch }"
              style="border: 0; display: block;"
              border="0"
              :width="imageWidth"
              :style="{width: widthStyle(imageWidth)}"
              :src="imageUrl(component.image.attribute.placeholder)"
              :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
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
                  :style="{width: widthStyle(imageWidth)}"
                  :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                  :alt="component.image.attribute.alt"
                  :title="component.image.attribute.title">
              </div>
            </template>
          </a>
          <component-toolbar v-if="isStudio" :component-id="componentId" :column-id="columnId" />
        </td>
      </tr>
    </table>
  </module-container>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
import ComponentToolbar from './ComponentToolbar.vue';
import MobileStylesMixin from '../../common/mixins/MobileStylesMixin';
import ElementMixin from '../../common/mixins/ElementMixin';
import ModuleContainer from '../../common/containers/ModuleContainer.vue';

export default {
  name: 'ImageElement',
  components: {
    ComponentToolbar,
    ModuleContainer,
  },
  mixins: [MobileStylesMixin, ElementMixin],
  data() {
    return {
      imageUrl(imagePath) {
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

<style lang="less">
@icon-option: #69dac8;

.stx-position-relative {
  position: relative;
}
</style>
