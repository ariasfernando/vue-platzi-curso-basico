<template>
  <div v-show="(elementKey === currentElementKey)" class="settings-wrapper">
    <SettingsContainer :no-label="true">
      <template slot="setting-bottom">
        <StuiButton
          type="gray"
          width="full"
          @click="showModal('desktop')">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Image
        </StuiButton>
      </template>
    </SettingsContainer>
    <SettingsContainer v-if="hasImageMobile" :no-label="true">
      <template slot="setting-bottom">
        <StuiButton
          type="gray"
          width="full"
          :disabled="!plugin.data.img"
          @click="showModal('mobile')">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Mobile Image
        </StuiButton>
      </template>
    </SettingsContainer>
    <SettingsContainer label="Alternative Text">
      <template slot="setting-right">
        <StuiInputText
          v-if="validationRules"
          v-model="alt"
          v-validate.initial="validationRules"
          name="alt"
          placeholder="Alt text"
          :validation-notif="{
            type: 'error',
            msg: getErrorMessage,
            show: hasError,
          }" />
        <StuiInputText
          v-else
          v-model="alt"
          class="image-alt-text"
          placeholder="Alt text" />
      </template>
    </SettingsContainer>
    <ImageModal
      v-if="showImageEditor"
      :config="plugin.config"
      :library-images="libraryImages"
      :overlay-images="overlayImages"
      :data="image"
      @close="close"
      @submitImage="submitImage" />
  </div>
</template>

<script>
import ImageModal from '../../../components/common/ImageModal/index.vue';
import imageService from '../../../services/image';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import validatorMixin from '../mixins/validatorMixin';

export default {
  mixins: [validatorMixin, pluginCampaignMixin],
  components: {
    ImageModal,
    SettingsContainer,
  },
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      overlayImages: [],
      type: 'desktop',
      subComponent: 'image',
      image: {},
      isEdit: false,
    };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
    alt: {
      get() {
        return this.element.image.attribute.alt;
      },
      set(value) {
        this.saveAttributeInThisElement({
          property: 'alt',
          value,
        });
        this.$nextTick(() => {
          if (this.validationRules) {
            this.validate();
          }
        });
      },
    },
    validationRules() {
      const rules = [];
      if (this.plugin.config.alt && this.plugin.config.alt.validations) {
        _.each(this.plugin.config.alt.validations, (e, i) => {
          if (e) {
            rules.push(i);
          }
        });
        return rules.join('|');
      }
      return false;
    },
    hasImageMobile() {
      return this.element.image.styleOption.hasImageMobile;
    },
  },
  created() {
    if (this.plugin.config.library.config.set_images && this.plugin.config.library.config.set_images.value) {
      imageService.getMedia(this.plugin.config.library.config.set_images.value)
        .then((res) => {
          this.libraryImages = res.map(image => image.path);
        });
    }
    const ovGallery = _.get(this.plugin.config, 'sie-plugin-image-overlay_image.config.overlay_gallery.config.set_images.value');
    if (ovGallery !== null) {
      imageService.getMedia(ovGallery).then((res) => {
        this.overlayImages = res.map(image => image.path);
      });
    }
  },
  methods: {
    close() {
      this.showImageEditor = false;
      this.type = 'desktop';
      this.image = {};
    },
    submitImage(data) {
      const imgs = [];
      data.images.forEach((image) => {
        imgs.push(image.image);
      });
      this.$store
        .dispatch('campaign/uploadImages', {
          images: imgs,
          campaignId: this.campaign.campaign_id,
        })
        .then((uploadedImgs) => {
          this.updateAttribute(uploadedImgs[imgs.length - 1], data.newImage);
          if (typeof this.plugin.config.adjust !== 'undefined' && this.plugin.config.adjust.value) {
            this.saveAttributeInThisElement({
              property: 'width',
              value: data.state.outputSize.width,
            });
          }
          const temp = {};
          if (this.type === 'desktop') {
            temp.img = data.img;
            temp.state = data.state;
            if (data.newImage && this.isEdit) {
              if (typeof this.plugin.data.imgMobile !== 'undefined') {
                temp.imgMobile = data.img;
                temp.stateMobile = data.state;
              }
            }
          } else {
            temp.imgMobile = data.img;
            temp.stateMobile = data.state;
          }
          this.updatePluginData(uploadedImgs, data.images, {
            ...this.plugin.data,
            ...temp,
          }, data.newImage);
          this.$store.commit('global/setLoader', false);
          this.showImageEditor = false;
          this.type = 'desktop';
        });
    },
    updatePluginData(uploadedImgs, images, data, newImage) {
      images.slice(0, images.length - 1).forEach((image) => {
        const i = images.indexOf(image);
        const keys = image.key.split('.');
        const img = uploadedImgs[i];
        let subData = data[`state${this.type === 'mobile' ? 'Mobile' : ''}`].preset;
        keys.forEach((key) => {
          if (keys.indexOf(key) === keys.length - 1) {
            subData[key] = img;
          } else {
            subData = subData[key];
          }
        });
      });
      if (this.type === 'desktop') {
        data.img = uploadedImgs[images.length - 1];
        if (newImage && this.isEdit) {
          if (typeof this.plugin.data.imgMobile !== 'undefined') {
            data.imgMobile = uploadedImgs[images.length - 1];
          }
        }
      } else {
        data.imgMobile = uploadedImgs[images.length - 1];
      }
      delete data.images;
      this.$store.commit('campaign/savePlugin', {
        plugin: this.pluginKey,
        moduleId: this.elementLocation.moduleId,
        columnId: this.elementLocation.columnId,
        componentId: this.elementLocation.componentId,
        data,
      });
    },
    updateAttribute(image, newImage) {
      this.removeErrorsImages();
      const payload = {
        value: image,
      };
      if (this.type === 'desktop') {
        payload.property = 'placeholder';
        this.saveAttributeInThisElement(payload);

        if (newImage && this.isEdit) {
          if (typeof this.plugin.data.imgMobile !== 'undefined') {
            payload.property = 'placeholderMobile';
            this.saveAttributeInThisElement(payload);
          }
        }
      } else {
        payload.property = 'placeholderMobile';
        this.saveAttributeInThisElement(payload);
      }
    },
    removeErrorsImages() {
      const $contentImgError = $('.stx-module-wrapper-active').find('.default-image-error');
      if ($contentImgError.length > 0) {
        $contentImgError.removeClass('default-image-error');
      }
    },
    showModal(type) {
      if (type !== null && type !== '') {
        this.type = type;
      }
      if (Object.keys(this.plugin.data).length > 0) {
        const temp = this.plugin.data;
        if (this.type === 'desktop') {
          if (typeof temp.img !== 'undefined') {
            this.isEdit = true;
            this.image = {
              img: temp.img,
              state: temp.state,
            };
          }
        } else if (typeof temp.imgMobile !== 'undefined') {
          this.isEdit = true;
          this.image = {
            img: temp.imgMobile,
            state: temp.stateMobile,
          };
        } else {
          this.isEdit = true;
          this.image = {
            img: temp.img,
            state: temp.state,
          };
        }
      }
      this.showImageEditor = true;
    },
  },
};
</script>
