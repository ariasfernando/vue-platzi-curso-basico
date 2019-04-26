<template>
  <div class="settings-wrapper plugin-wrapper">
    <SettingsContainer :no-label="true">
      <template slot="setting-bottom">
        <stui-button
          type="gray"
          width="full"
          @click="showModal">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Background Image
        </stui-button>
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
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import validatorMixin from '../mixins/validatorMixin';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import imageService from '../../../services/image';

export default {
  components: {
    ImageModal,
    SettingsContainer,
  },
  mixins: [validatorMixin, pluginCampaignMixin],
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      overlayImages: [],
      image: {},
      isEdit: false,
    };
  },
  created() {
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
      this.image = {};
    },
    submitImage(data) {
      const imgs = [];
      data.images.forEach(image =>
        imgs.push(image.image),
      );
      this.$store
        .dispatch('campaign/uploadImages', {
          images: imgs,
          campaignId: this.campaign.campaign_id,
        })
        .then((uploadedImgs) => {
          this.updateProperty('style', 'backgroundImage', uploadedImgs[imgs.length - 1]);
          if (this.plugin.config['background-style-image-editor'].config.backgroundSize) {
            this.updateProperty('style', 'backgroundSize', this.plugin.config['background-style-image-editor'].config.backgroundSize);
          }
          if (this.plugin.config['background-style-image-editor'].config.assignHeight) {
            this.updateProperty('attribute', 'height', data.state.outputSize.height);
          }
          if (this.plugin.config['background-style-image-editor'].config.addClassEqualHeight) {
            this.addClassToElement({value:'st-equal-height'});
          }
          const temp = {};
          temp.img = data.img;
          temp.state = data.state;
          this.updatePluginData(uploadedImgs, data.images, {
            ...this.plugin.data,
            ...temp,
          }, data.newImage);
          this.$store.commit('global/setLoader', false);
          this.showImageEditor = false;
        });
    },
    updatePluginData(uploadedImgs, images, data) {
      images.slice(0, images.length - 1).forEach((image) => {
        const i = images.indexOf(image);
        const keys = image.key.split('.');
        const img = uploadedImgs[i];
        let subData = data.state.preset;
        keys.forEach((key) => {
          if (keys.indexOf(key) === keys.length - 1) {
            subData[key] = img;
          } else {
            subData = subData[key];
          }
        });
      });
      delete data.images;
      this.saveElementInThisPluginData({
        value: data,
      });
    },
    updateProperty(link, property, value) {
      this.saveElementProperty({
        link,
        property,
        value,
      });
    },
    showModal() {
      if (Object.keys(this.plugin.data).length > 0) {
        const temp = this.plugin.data;
        if (typeof temp.img !== 'undefined') {
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

