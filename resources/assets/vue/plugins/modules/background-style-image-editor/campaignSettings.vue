<template>
  <div class="settings-wrapper plugin-wrapper">
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <stui-button
          type="gray"
          width="full"
          @click="showModal">
          <i class="glyphicon glyphicon-cloud-upload" />
          Upload Background Image
        </stui-button>
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
import ImageModal from '../../../components/common/ImageModal/index.vue';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import validatorMixin from '../mixins/validator';

export default {
  components: {
    ImageModal,
    SettingsContainer,
  },
  mixins: [validatorMixin],
  props: ['name', 'plugin', 'pluginKey', 'moduleId', 'module'],
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      overlayImages: [],
      image: {},
      isEdit: false,
    };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
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
            this.addClassEqualHeight();
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
      this.$store.commit('campaign/savePlugin', {
        plugin: this.pluginKey,
        moduleId: this.moduleId,
        data,
      });
    },
    updateProperty(link, property, value) {
      this.$store.commit('campaign/saveModuleProperty', {
        moduleId: this.moduleId,
        link,
        property,
        value,
      });
    },
    addClassEqualHeight() {
      let classes = this.module.structure.attribute.classes;
      const classesArr = classes ? classes.split(' ') : [];
      const index = classesArr.indexOf('st-equal-height');
      if (index === -1) {
        classesArr.push('st-equal-height');
        classes = classesArr.join(' ');
        this.updateProperty('attribute', 'classes', classes);
      }
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

