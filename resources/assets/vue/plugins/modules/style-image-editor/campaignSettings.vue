<template>
  <div class="settings-wrapper plugin-wrapper" v-if="component">
    <div class="plugin-wrapper-inner">
      <span>
        <button @click="showModal('desktop')">
          <i class="glyphicon glyphicon-cloud-upload"></i> Update Image
        </button>
      </span>
    </div>
    <div class="plugin-wrapper-inner" v-if="params.mobile">
      <span>
        <button @click="showModal('mobile')">
          <i class="glyphicon glyphicon-cloud-upload"></i> Update Image Mobile
        </button>
      </span>
    </div>
    <div class="plugin-wrapper-inner">
      <span>
        <label>Alt</label>
        <el-input v-model="alt" class="image-alt-text" placeholder="Alt text"></el-input>
      </span>
    </div>
    <transition name="style">
      <div id="style-image-editor" class="modal-mask" :class="{'page-3': page.three}" v-show="showImageEditor">
        <div class="modal-wrapper">
          <div class="modal-container" v-bind:class="{ 'page-1': page.one, 'media-gallery' : page.two === 'media', 'url' : page.two === 'url' }">
            <div class="modal-header">
              <slot name="header">
                <button type="button" class="close" @click="close">
                  <span>&times;</span>
                </button>
                <h3 v-if="page.three">{{ params.title || 'Image Editor' }}</h3>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <div v-show="page.one">
                  <div style="display: flex; flex-direction: row; justify-content: space-between;">
                    <div>
                      <button type="button" @click="clickUpload">
                        <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                        <p>Upload</p>
                      </button>
                      <input ref="input" type="file" name="file" style="display: none;"/>
                    </div>
                    <div v-if="params.library">
                      <button type="button" @click="clickGallery">
                        <i class="fa fa-picture-o" aria-hidden="true"></i>
                        <p>Media Gallery</p>
                      </button>
                    </div>
                    <div v-if="params.url">
                      <button type="button" @click="clickUrl" >
                        <i class="fa fa-link" aria-hidden="true"></i>
                        <p>URL</p>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-show="page.two === 'media'" style="display: flex;">
                  <div class="wrapper-image" v-for="(image, index) in libraryImages" :key="index" @click="chooseImage(image)">
                    <div style="width: 100%; padding-bottom: 100%; background-size: cover;" v-bind:style="{ backgroundImage: `url(${image})` }"></div>
                  </div>
                </div>
                <div v-show="page.two === 'url'">
                  <div class="row">
                    <div class="col-md-12">
                      <label for="url">URL</label>
                      <p class="control">
                        <div class="el-input" aria-required="true" aria-invalid="false">
                          <input v-model="url" type="text" autocomplete="off" placeholder="" style="font-family: 'Open Sans', Arial, serif; width: 100%; padding: 8px; font-size: 13px; font-weight: 300; color: #666666; border: 1px solid #dddddd; background: #fff; box-sizing: border-box; border-top-right-radius: 2px; border-top-left-radius: 2px; border-bottom-right-radius: 2px; border-bottom-left-radius: 2px;" />
                        </div>
                        <span class="help is-danger" style="display: none;"></span>
                      </p>
                    </div>
                  </div>
                </div>
                <div v-show="page.three" style="overflow-y: auto; max-height: calc(100vh - 187px); min-height: 300px; height:100%" ref="wrapperSie">
                  <style-image-editor
                    :key="sieKey"
                    v-if="page.three"
                    :sieoptions="sieoptions"
                    ref="sie"
                    @image-submit="submitImage"
                    ></style-image-editor>
                </div>
              </slot>
            </div>
            <div class="modal-footer" v-show="page.one !== true">
              <slot name="footer">
                <!-- Input submit -->
                <div class="modal-mpf-submit">
                  <button type="button" class="btn btn-success pull-left submit-config beta-btn-primary" v-if="page.two" @click="back">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
                  </button>
                  <button type="button" class="btn btn-success pull-left submit-config beta-btn-primary" v-if="page.three" @click="clear">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i> Reset
                  </button>
                  <button type="button" class="btn btn-success pull-right submit-config beta-btn-primary" v-if="page.two === 'url'" v-on:click.prevent="saveUrl">Save</button>
                  <input type="submit" value="Submit" class="btn btn-success pull-right submit-config beta-btn-primary" @click="submit" v-if="page.three">
                  <button type="button" class="btn btn-success pull-right submit-config beta-btn-primary" v-if="page.two === 'media'">
                    <i class="fa fa-refresh" aria-hidden="true"></i> Refresh Gallery
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import each from 'lodash/each';
import imageService from '../../../services/image';
import styleImageEditor from 'stensul-sie-vue';
import imageHelper from './image-helper';
import sieHelper from './sie-helper';

export default {
  props: ['name', 'plugin'],
  components: {
    styleImageEditor
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
    params() {
      let params = {};
      _.each(this.plugin.config, (option, key) => {
        if (option.value === true && option.config) {
          params[key] = option.config;
        } else {
          params[key] = option.value;
        }
      });
      params = this.changeImage(params);
      return params;
    },
    alt: {
      get() {
        return this.component.image.attribute.alt;
      },
      set(value) {
        const payload = {
          plugin: this.name,
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
    }
  },
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      page: {
        one: true,
        two: false,
        three: false
      },
      currentImage: null,
      url: '',
      type: 'desktop',
      sieKey: 1,
      sieoptions: {}
    };
  },
  created() {
    if (
      this.params.library.set_images &&
      this.params.library.set_images.value
    ) {
      imageService.getMedia(this.params.library.set_images.value).then(res => {
        this.libraryImages = res.map(image => image.path);
      });
    }
  },
  methods: {
    changeImage(params) {
      const urlDefault =
        params['sie-plugin-image_upload']['uploaddefault']['value'];
      const options = JSON.parse(JSON.stringify(params));
      if (urlDefault === '' && this.currentImage !== null) {
        options[
          'sie-plugin-image_upload'
        ].uploaddefault.value = this.currentImage;
      }
      Object.assign(params, options);

      return params;
    },
    clickUpload() {
      this.$refs.input.click();
    },
    clickGallery() {
      this.page.one = false;
      this.page.two = 'media';
    },
    clickUrl() {
      this.page.one = false;
      this.page.two = 'url';
    },
    submit() {
      this.$refs.sie.save();
      this.sieKey++;
    },
    close() {
      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
        this.sieKey++;
      }
      this.showImageEditor = false;
    },
    back() {
      this.page = {
        one: true,
        two: false,
        three: false
      };
      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
        this.sieKey++;
      }
    },
    clear() {
      this.page = {
        one: true,
        two: false,
        three: false
      };
      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
        this.sieKey++;
      }

      this.currentImage = null;
    },
    generateSieoptions(changeImage = false) {
      const sieoptions = {};
      if (
        typeof this.plugin.data === 'undefined' ||
        Array.isArray(this.plugin.data) ||
        changeImage
      ) {
        const transformedOptions = sieHelper.transform(this.params);
        Object.assign(sieoptions, transformedOptions);
      } else {
        Object.assign(sieoptions, this.plugin.data.state);
        sieoptions.preset = sieHelper.completeUrlPath(
          this.$_app.config.imageUrl,
          sieoptions.preset
        );
      }

      sieoptions.size.height = sieoptions.size.auto ? 0 : sieoptions.size.height;

      this.sieoptions = sieoptions;

      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
        this.sieKey++;
      }
    },
    setImage(imageSource) {
      this.currentImage = imageSource;

      this.changeImage(this.params);

      this.generateSieoptions(true);

      this.page = {
        one: false,
        two: false,
        three: true
      };
    },
    chooseImage(url) {
      return imageHelper.getBase64ImgFromURL(url).then(imgSrc => {
        this.setImage(imgSrc);
      });
    },
    saveUrl(event) {
      return imageHelper.getBase64ImgFromURL(this.url).then(imgSrc => {
        this.setImage(imgSrc);
      });
    },
    submitImage(data) {
      this.$store.commit('global/setLoader', true);
      data.state.preset = sieHelper.removeUrlPath(
        this.$_app.config.imageUrl,
        data.state.preset
      );
      const images = sieHelper.searchStateImages(data.state);
      images.push({ key: 'img', image: data.img });
      const imgs = [];
      images.forEach(image => {
        imgs.push(image.image);
      });
      this.$store
        .dispatch('campaign/uploadImages', {
          images: imgs,
          campaignId: this.campaign.campaign_id
        })
        .then(uploadedImgs => {
          this.updateAttribute(uploadedImgs[imgs.length - 1]);
          this.updatePluginData(uploadedImgs, images, data);
          this.$store.commit('global/setLoader', false);
          this.showImageEditor = false;
        });
    },
    updatePluginData(uploadedImgs, images, data) {
      images.slice(0, images.length - 1).forEach(image => {
        const i = images.indexOf(image);
        const keys = image.key.split('.');
        const img = uploadedImgs[i];
        let subData = data.state.preset;
        keys.forEach(key => {
          if (keys.indexOf(key) === keys.length - 1) {
            subData[key] = img;
          } else {
            subData = subData[key];
          }
        });
      });
      data.img = uploadedImgs[images.length - 1];
      this.$store.commit('campaign/savePlugin', {
        plugin: this.name,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        data: data
      });
      this.generateSieoptions();
    },
    updateAttribute(image) {
      this.removeErrorsImages();

      const payload = {
        plugin: this.name,
        moduleId: this.currentComponent.moduleId,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        subComponent: 'image',
        link: 'attribute',
        property: `placeholder${this.type === 'mobile' ? 'Mobile' : ''}`,
        value: image
      };

      this.$store.commit('campaign/saveComponentProperty', payload);
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

      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
        this.sieKey++;
      }

      this.showImageEditor = true;
    }
  },
  mounted() {
    const urlDefault = this.params['sie-plugin-image_upload']['uploaddefault'][
      'value'
    ];
    this.page.one = urlDefault === '';
    this.page.three = urlDefault !== '';

    if (Object.keys(this.plugin.data).length > 0) {
      this.page = {
        one: false,
        two: false,
        three: true
      };
    }
    this.$refs.input.addEventListener('change', event => {
      event.target.setCustomValidity('');
      return imageHelper
        .checkFile(event.target)
        .then(image => {
          return imageHelper.getBase64ImgFromFile(image).then(imgSrc => {
            this.setImage(imgSrc);
          });
        })
        .catch(() => {
          // TODO: Show toast with error.
          event.target.reportValidity();
        });
    });

    this.generateSieoptions();
  },
  beforeDestroy() {
    if (typeof this.$refs.sie !== 'undefined') {
      this.$refs.sie.close();
    }
  }
};
</script>
<style lang="less" scoped>
#style-image-editor {
  padding-top: 0px !important;
  .modal-wrapper {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 80%;
    .modal-container,
    .modal-body {
      width: 100%;
      max-height: none;
    }
  }
}
.page-3 {
  .modal-wrapper {
    height: calc(100vh - 5%);
    .modal-container {
      height: 100%;
    }
    .modal-body {
      height: calc(100vh - 260px);
      margin-top: 5px;
    }
  }
}
.modal-mask {
  z-index: 5000;
}
.page-1 {
  max-width: 680px;
  .modal-body {
    padding: 50px 70px !important;
    margin-bottom: 0px;
    height: auto;
    button {
      margin-bottom: 0px;
      border: 1px solid #f4f4f4;
      padding-top: 20px;
      padding-bottom: 20px;
      min-width: 130px;
      background-color: #e9e9e9;
      transition: all 0.3s linear;
      &:hover {
        border: 1px solid #514960;
        box-shadow: 0px 0px 4px #888888;
      }
    }
  }
}
.media-gallery {
  max-width: 900px;
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;
  overflow-y: scroll;
  .wrapper-image {
    width: 180px;
    height: 180px;
    padding: 5px;
    border: 1px solid #f4f4f4;
    margin-bottom: 20px;
    margin-right: 20px;
    transition: all 0.3s linear;
    cursor: pointer;
    &:hover {
      border: 1px solid #514960;
      box-shadow: 0px 0px 4px #888888;
    }
  }
}
.url {
  max-width: 700px;
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
  label {
    font-weight: bold !important;
  }
}
.style-enter-active,
.style-leave-active {
  transition: opacity 0.5s;
}
.style-enter,
.style-leave-to {
  opacity: 0;
}
</style>
