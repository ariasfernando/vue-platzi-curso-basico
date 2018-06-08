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
        <el-input v-model="alt" class="image-alt-text" placeholder="Alt text"></el-input>
      </span>
    </div>
    <image-modal 
    :config="plugin.config" 
    v-if="showImageEditor" 
    :libraryImages="libraryImages" 
    :data="image" 
    @close="close" 
    @submitImage="submitImage">
    </image-modal>
  </div>
</template>

<script>
import imageService from '../../../services/image';
import imageModal from '../../../components/common/ImageModal';

export default {
  props: ['name', 'plugin', 'pluginKey'],
  components: {
    imageModal
  },
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
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
          const temp = {};
          if (this.type === 'desktop') {
            temp.img = data.img;
            temp.state = data.state;
            if (data.newImage === true && this.isEdit === true) {
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
        if (newImage === true && this.isEdit === true) {
          if (typeof this.plugin.data.imgMobile !== 'undefined') {
            data.imgMobile = uploadedImgs[images.length - 1];
          }
        }
      } else {
        data.imgMobile = uploadedImgs[images.length - 1];
      }
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
        payload.property = 'placehoder';
        this.$store.commit('campaign/saveComponentProperty', {
          ...payload,
          property: 'placeholder'
        });
        if (newImage === true && this.isEdit === true) {
          if (typeof this.plugin.data.imgMobile !== 'undefined') {
            this.$store.commit('campaign/saveComponentProperty', {
              ...payload,
              property: 'placeholderMobile'
            });
          }
        }
      } else {
        this.$store.commit('campaign/saveComponentProperty', {
          ...payload,
          property: 'placeholderMobile'
        });
      }
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
