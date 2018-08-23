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
                class="st-resize"
                :class="{'st-hide-mobile' : component.image.attribute.placeholderMobile}"
                style="border: 0; display: block;"
                border="0"
                :width="imageWidth"
                :src="imageUrl(component.image.attribute.placeholder)"
                :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
                :alt="component.image.attribute.alt"
                :title="component.image.attribute.title"
              >
              <template 
                v-if="component.image.attribute.placeholderMobile">
                <div class="show-img-mobile" style="display:none;width:0;overflow:hidden;max-height:0!important;">
                  <img
                    :src="imageUrl(component.image.attribute.placeholderMobile)"
                    border="0"
                    class="st-resize"
                    style="display:block;border:none;max-width:100%;height:auto;"
                    :width="imageWidth"
                    :height="component.image.attribute.height === 'auto' ? undefined : component.image.attribute.height"
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
    </module-container>
  <!-- IMAGE ELEMENT ENDS -->
</template>

<script>
  import _ from 'lodash';
  import ComponentToolbar from './ComponentToolbar.vue';
  import MobileStylesMixin from '../../common/mixins/MobileStylesMixin.js';
  import ElementMixin from '../../common/mixins/ElementMixin';
  import MontedElementMixin from '../mixins/MontedElementMixin';
  import ModuleContainer from '../../common/containers/ModuleContainer';
  export default {
    name: 'ImageElement',
    components: {
      ComponentToolbar,
      ModuleContainer
    },
    mixins: [ MobileStylesMixin, ElementMixin, MontedElementMixin ],
    data(){
      return {
        imageUrl(imagePath) {
          return this.$_app.config.imageUrl + imagePath;
        }
      }
    },
  };
</script>

<style lang="less">
  @icon-option: #69dac8;

  .stx-position-relative{
    position: relative;
  }
</style>
