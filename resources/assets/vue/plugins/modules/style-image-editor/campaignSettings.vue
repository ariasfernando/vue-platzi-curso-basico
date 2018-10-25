<template>
  <div class="settings-wrapper plugin-wrapper">
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <el-button type="primary" @click="showModal('desktop')">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Image
        </el-button>
      </template>
    </settings-container>
    <settings-container v-if="hasImageMobile" :no-label="true">
      <template slot="setting-bottom">
        <el-button type="primary" size="mini" @click="showModal('mobile')" :disabled="!plugin.data.img">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Mobile Image
        </el-button>
      </template>
    </settings-container>
    <settings-container label="Alt">
      <template slot="setting-bottom">
        <el-input
          v-if="validationRules"
          v-model="alt"
          v-validate.initial="validationRules"
          name="alt"
          type="text"
          placeholder="Alt text"
          size="mini"
          class="image-alt-text"
          :class="{'input': true, 'is-danger': hasError }" />
        <el-input
          v-else
          v-model="alt"
          class="image-alt-text"
          placeholder="Alt text" />
        <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
      </template>
    </settings-container>
    <image-modal
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
import ImageModal from '../../../components/common/ImageModal';
import imageService from '../../../services/image';
import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
import validatorMixin from '../mixins/validatorMixin';

export default {
  mixins: [validatorMixin, pluginGenericCampaignMixin, pluginElementCampaignMixin],
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
      if (this.plugin.config.alt && this.plugin.config.alt.validations){
        _.each(this.plugin.config.alt.validations, (e,i) => {
          if (e) {
            rules.push(i);
          }
        });
        return rules.join('|');
      }
    },
    hasImageMobile() {
      return this.element.image.styleOption.hasImageMobile;
    },
  },
  created() {
    if (this.plugin.config.library.config.set_images && this.plugin.config.library.config.set_images.value) {
      imageService.getMedia(this.plugin.config.library.config.set_images.value)
        .then(res => {
          this.libraryImages = res.map(image => image.path);
        });
    }
    const ovGallery = _.get(this.plugin.config, 'sie-plugin-image-overlay_image.config.overlay_gallery.config.set_images.value');
    if (ovGallery !== null) {
      imageService.getMedia(ovGallery).then(res => {
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
      data.images.forEach(image => {
        imgs.push(image.image);
      });
      this.$store
        .dispatch('campaign/uploadImages', {
          images: imgs,
          campaignId: this.campaign.campaign_id,
        })
        .then(uploadedImgs => {
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
      images.slice(0, images.length - 1).forEach(image => {
        const i = images.indexOf(image);
        const keys = image.key.split('.');
        const img = uploadedImgs[i];
        let subData = data[`state${this.type === 'mobile' ? 'Mobile' : ''}`].preset;
        keys.forEach(key => {
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
        } else {
          if (typeof temp.imgMobile !== 'undefined') {
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
      }
      this.showImageEditor = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-button {
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  padding: 6px 20px;
  border-radius: 2px;
  margin-top: 5px;
}

.el-button--primary {
  &.is-disabled,
  &.is-disabled:active,
  &.is-disabled:focus,
  &.is-disabled:hover {
    opacity: 0.4;
    border-color: rgb(120, 220, 214);
    background-color: rgb(120, 220, 214);
    margin-left: 0px;
  }
}

.el-button + .el-button {
  margin-left: 0;
}

.el-input /deep/ .el-input__inner{
  border-radius: 2px;
  font-weight: 300;
  padding-left: 8px;
  height: 26px;
  font-size: 12px;

  &:focus{
    border: 1px solid #78dcd6;
  }
}
</style>