<template>
  <div class="settings-wrapper plugin-wrapper" v-if="component">
    <div class="plugin-wrapper-inner">
      <span>
        <button @click="showModal('desktop')">
          <i class="glyphicon glyphicon-cloud-upload"></i> Upload Image
        </button>
      </span>
    </div>
    <div class="plugin-wrapper-inner" v-if="hasImageMobile">
      <span>
        <button @click="showModal('mobile')" :disabled="!plugin.data.img">
          <i class="glyphicon glyphicon-cloud-upload"></i> Upload Mobile Image
        </button>
      </span>
    </div>
    <div class="plugin-wrapper-inner">
      <span>
        <label>Alt</label>
        
        <p v-if="validationRules">
          <input
            name="alt"
            type="text"
            placeholder="Alt text"
            v-model="alt"
            v-validate.initial="validationRules"
            :class="{'input': true, 'is-danger': hasError }">
          <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
        </p>
        <p v-else>
          <el-input v-model="alt" class="image-alt-text" placeholder="Alt text"></el-input>
        </p>
      </span>
    </div>
    <image-modal 
    :config="plugin.config" 
    v-if="showImageEditor" 
    :libraryImages="libraryImages" 
    :overlayImages="overlayImages" 
    :data="image" 
    @close="close" 
    @submitImage="submitImage">
    </image-modal>
  </div>
</template>

<script>
import imageService from '../../../services/image';
import imageModal from '../../../components/common/ImageModal';
import _ from 'lodash';
import validatorMixin from '../mixins/validator';

export default {
  props: ['name', 'plugin', 'pluginKey'],
  mixins: [validatorMixin],
  components: {
    imageModal
  },
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      overlayImages: [],
      type: 'desktop',
      image: {},
      isEdit: false
    };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
    currentComponent() {
      return this.$store.getters['campaign/currentComponent'];
    },
    module() {
      return this.$store.getters["campaign/modules"][this.currentComponent.moduleId];
    },
    component() {
      let component = {};

      if (Object.keys(this.currentComponent).length !== 0) {
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;

        component = this.$store.getters['campaign/modules'][moduleId].structure
          .columns[columnId].components[componentId];
      }

      return component;
    },
    alt: {
      get() {
        return this.component.image.attribute.alt;
      },
      set(value) {
        const payload = {
          plugin: this.pluginKey,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          subComponent: 'image',
          link: 'attribute',
          property: 'alt',
          value
        };
        this.$store.commit('campaign/saveComponentProperty', payload);
        if (this.validationRules) {
          this.validate();
        }
      }
    },
    validationRules() {
        const rules = [];
        if(this.plugin.config.alt && this.plugin.config.alt.validations){
          _.each(this.plugin.config.alt.validations, (e,i) => {
            if (e) {
              rules.push(i);
            }
          });
          return rules.join('|');
        }
    },
    hasImageMobile() {
      return this.component.image.styleOption.hasImageMobile;
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
    if(ovGallery !== null){
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
          campaignId: this.campaign.campaign_id
        })
        .then(uploadedImgs => {
          this.updateAttribute(uploadedImgs[imgs.length - 1], data.newImage);
          if(typeof this.plugin.config.adjust !== 'undefined' && this.plugin.config.adjust.value) {
            this.updateWidthAttribute(data.state.outputSize.width);
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
            ...temp
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
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        data: data
      });
    },
    updateAttribute(image, newImage) {
      this.removeErrorsImages();
      const payload = {
        plugin: this.pluginKey,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: 'image',
        link: 'attribute',
        value: image
      };
      if (this.type === 'desktop') {
        payload.property = 'placeholder';
        this.$store.commit('campaign/saveComponentProperty', payload);

        if (newImage && this.isEdit) {
          if (typeof this.plugin.data.imgMobile !== 'undefined') {
            payload.property = 'placeholderMobile';
            this.$store.commit('campaign/saveComponentProperty',payload);
          }
        }
      } else {
        payload.property = 'placeholderMobile';
        this.$store.commit('campaign/saveComponentProperty', payload);
      }
    },
    updateWidthAttribute(newWidth){
      this.$store.commit('campaign/saveComponentProperty', {
        plugin: this.pluginKey,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: 'image',
        link: 'attribute',
        property: 'width',
        value: newWidth
      });
    },
    removeErrorsImages() {
      let $contentImgError = $('.stx-module-wrapper-active').find(
        '.default-image-error'
      );
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
              state: temp.state
            };
          }
        } else {
          if (typeof temp.imgMobile !== 'undefined') {
            this.isEdit = true;
            this.image = {
              img: temp.imgMobile,
              state: temp.stateMobile
            };
          } else {
            this.isEdit = true;
          this.image = {
              img: temp.img,
              state: temp.state
          };
        }
      }
      }
      this.showImageEditor = true;
    },
  },
};
</script>
