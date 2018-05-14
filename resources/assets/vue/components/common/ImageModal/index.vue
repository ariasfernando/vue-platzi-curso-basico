<template>
  <transition name="style">
    <div id="style-image-editor" class="modal-mask" :class="{'page-3': page.three}">
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
              <div v-show="page.one" class="wrapper-page-1">
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                  <div>
                    <button type="button" @click="clickUpload">
                      <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                      <p>Upload</p>
                    </button>
                    <input ref="input" type="file" name="file" style="display: none;" />
                  </div>
                  <div v-if="params.library">
                    <button type="button" @click="clickGallery">
                      <i class="fa fa-picture-o" aria-hidden="true"></i>
                      <p>Media Gallery</p>
                    </button>
                  </div>
                  <div v-if="params.url">
                    <button type="button" @click="clickUrl">
                      <i class="fa fa-link" aria-hidden="true"></i>
                      <p>URL</p>
                    </button>
                  </div>
                </div>
              </div>
              <div v-show="page.two === 'media'">
                <div class="library-container">
                  <div class="row" v-for="(section, sectionIndex) in images" :key="sectionIndex">
                    <div v-for="(imageUrl, imageIndex) in section" class="col-md-2" v-if="imageUrl !== undefined" :key="imageIndex">
                      <img :src="imageUrl !== undefined && imageUrl.indexOf('http') === 0 ? imageUrl : $_app.config.baseUrl + imageUrl" @click="chooseImage(imageUrl)">
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="page.two === 'url'">
                <div class="row">
                  <div class="col-md-12">
                    <label for="url">URL</label>
                    <div class="control">
                      <div class="el-input" aria-required="true" aria-invalid="false">
                        <input v-model="url" type="text" autocomplete="off" placeholder="" style="font-family: 'Open Sans', Arial, serif; width: 100%; padding: 8px; font-size: 13px; font-weight: 300; color: #666666; border: 1px solid #dddddd; background: #fff; box-sizing: border-box; border-top-right-radius: 2px; border-top-left-radius: 2px; border-bottom-right-radius: 2px; border-bottom-left-radius: 2px;" />
                      </div>
                      <span class="help is-danger" style="display: none;"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="page.three" style="overflow-y: auto; max-height: calc(100vh - 187px); min-height: 300px; height:100%" ref="wrapperSie">
                <style-image-editor v-if="page.three && this.currentImage" :sieoptions="sieOptions" ref="sie" @image-submit="submitImage">
                </style-image-editor>
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
                <button type="button" class="btn btn-success pull-left submit-config beta-btn-primary" v-if="page.three" @click="clear" style="min-width: 60px;">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-success pull-right submit-config beta-btn-primary" v-if="page.two === 'url'" v-on:click.prevent="saveUrl">Save</button>
                <input :disabled="isDisabled" type="submit" value="Submit" class="btn btn-success pull-right submit-config beta-btn-primary" @click="submit" v-if="page.three">
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import each from 'lodash/each';
import styleImageEditor from 'stensul-sie-vue';
import imageHelper from './image-helper';
import sieHelper from './sie-helper';

export default {
  props: ['config', 'libraryImages', 'data', 'resizeIfSmaller'],
  components: {
    styleImageEditor
  },
  data() {
    return {
      page: {
        one: true,
        two: false,
        three: false
      },
      url: '',
      currentImage: null,
      sieOptions: {},
      isDisabled: false
    };
  },
  computed: {
    params() {
      let params = {};
      _.each(this.config, (option, key) => {
        if (option.value === true && option.config) {
          params[key] = option.config;
        } else {
          params[key] = option.value;
        }
      });
      return this.changeImage(params);
    },
    images() {
      const sections = [];
      let i, chunk = 5;
      const tempArray = this.libraryImages.filter(item => {
        return item ? true : false;
      });
      for (i = 0; i < tempArray.length; i += chunk) {
        sections.push(tempArray.slice(i, i + chunk));
      }
      return sections;
    },
  },
  methods: {
    changeImage(params) {
      const urlDefault = params['sie-plugin-image_upload']['uploaddefault']['value'];
      const options = JSON.parse(JSON.stringify(params));
      if (urlDefault === '' && this.currentImage !== null) {
        options['sie-plugin-image_upload'].uploaddefault.value = this.currentImage;
      }
      return options;
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
    close() {
      this.reset();
      this.$emit('close');
    },
    back() {
      this.reset();
    },
    clear() {
      this.reset();
    },
    generateSieOptions(changeImage = false, newSize = {}) {
      const sieOptions = {
        api: this.$_app.config.sieAPI
      };
      if (Object.keys(this.data).length <= 0 || changeImage) {
        Object.assign(sieOptions, sieHelper.transform(this.params));
      } else {
        Object.assign(sieOptions, this.data.state);
        sieOptions.preset = sieHelper.completeUrlPath(this.$_app.config.imageUrl, sieOptions.preset);
      }

      Object.assign(sieOptions.size, newSize);
      sieOptions.size.height = sieOptions.size.auto ? 0 : sieOptions.size.height;

      this.sieOptions = sieOptions;
      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
      }
    },
    setImage(imageSource) {
      return imageHelper.checkGIFSize(imageSource, this.sieOptions.size)
        .then(() => imageHelper.adjustSize(this.resizeIfSmaller || false, imageSource, this.sieOptions.size))
        .then((newSize) => {
          this.currentImage = imageSource;
          this.changeImage(this.params);
          this.generateSieOptions(true, newSize);
          this.page = {
            one: false,
            two: false,
            three: true
          };
        })
        .catch(error => {
          this.$root.$toast(`${error}. Please try again.`, {
            className: 'et-error'
          });
        });
    },
    chooseImage(url) {
      return imageHelper.getBase64Img(url)
        .then(imgSrc => {
          this.setImage(imgSrc);
        })
        .catch(error => {
          this.$root.$toast(`${error}. Please try again.`, {
            className: 'et-error'
          });
        });
    },
    saveUrl(event) {
      return imageHelper.getBase64Img(this.url)
        .then(imgSrc => {
          this.setImage(imgSrc);
        })
        .catch(error => {
          this.$root.$toast(`${error}. Please try again.`, {
            className: 'et-error'
          });
        });
    },
    reset() {
      if (typeof this.$refs.sie !== 'undefined') {
        this.$refs.sie.close();
      }
      this.currentImage = null;
      this.page = {
        one: true,
        two: false,
        three: false
      };
    },
    submitImage(data) {
      data.state.preset = sieHelper.removeUrlPath(
        this.$_app.config.imageUrl,
        data.state.preset
      );
      const images = sieHelper.searchStateImages(data.state);
      images.push({
        key: 'img',
        image: data.img
      });
      data.images = images;
      this.$emit('submitImage', data);
    },
    submit() {
      this.$store.commit('global/setLoader', true);
      this.$refs.sie.save();
    },
    disableSubmit() {
      this.isDisabled = true;
    },
    enableSubmit() {
      this.isDisabled = false;
    }
  },
  mounted() {
    addEventListener('showSubToolbar', this.disableSubmit);
    addEventListener('saveEdit', this.enableSubmit)
    addEventListener('cancelEdit', this.enableSubmit)
    this.$refs.input.addEventListener('change', event => {
      return imageHelper
        .checkFile(event.target)
        .then(image => {
          return imageHelper.getBase64Img(image);
        })
        .then(imgSrc => {
          this.setImage(imgSrc);
        })
        .catch(error => {
          this.$root.$toast(`Oops! Something went wrong! ${error}. Please try again.`, {
            className: 'et-error'
          });
        });
    });
    if (Object.keys(this.data).length > 0) {
      this.currentImage = this.data.img;
      this.page = {
        one: false,
        two: false,
        three: true
      };
    }
    this.generateSieOptions();
  },
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
    .modal-header {
      padding: 5px;
    }
    .modal-container {
      height: 100%;
    }
    .modal-body {
      margin: 0;
      height: calc(100vh - 175px);
    }
    .modal-footer {
      padding-top: 10px;
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
    margin-top: 0px;
    height: auto;
    text-align: center;
    .wrapper-page-1 {
      width: 100%;
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
}
.media-gallery {
  max-width: 900px;
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;
  overflow-y: scroll;
  .library-container {
    width: 100%;
    margin: 20px auto;
    border: 1px solid #eaeaea;
    padding: 20px;
    .row {
      .col-md-2 {
        background-color: #f6f6f6;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 13px;
        overflow: hidden;
        img {
          padding: 3px;
          cursor: pointer;
          width: 100%;
          vertical-align: middle;
        }
      }
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
