<template>
  <div class="settings-wrapper plugin-wrapper" v-if="component">
    <div class="plugin-wrapper-inner">
      <span>
        <button @click="showImageEditor = true">
          <i class="glyphicon glyphicon-cloud-upload"></i> Update Image
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
      <div id="master-image-editor" class="modal-mask" v-show="showImageEditor">
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
                    <div>
                      <button type="button" @click="clickGallery">
                        <i class="fa fa-picture-o" aria-hidden="true"></i>
                        <p>Media Gallery</p>
                      </button>
                    </div>
                    <div>
                      <button type="button" @click="clickUrl">
                        <i class="fa fa-link" aria-hidden="true"></i>
                        <p>URL</p>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-show="page.two === 'media'" style="display: flex;">
                  <div class="wrapper-image" v-for="(image, index) in libraryImages" :key="index" @click="setImage(image)">
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
                <div v-show="page.three" style="overflow-y: auto; max-height: calc(100vh - 187px); min-height: 300px;" ref="wrapperSie">
                  <stensul-sie-vue
                    v-if="page.three"
                    :params="params"
                    ref="sie"
                    :data="plugin.data"
                    @image-submit="submitImage"
                    ></stensul-sie-vue>
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
import stensulSieVue from 'stensul-sie-vue';

export default {
    props: ['name', 'plugin'],
    components: {
        stensulSieVue
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

                component = this.$store.getters['campaign/modules'][moduleId]
                    .structure.columns[columnId].components[componentId];
            }

            return component;
        },
        params() {
            const params = {};

            const config = this.plugin.config;

            Object.keys(config).forEach(name => {
                const local = config[name];

                if (name === 'sie-plugin-image_upload') {
                    if (local.config) {
                        if (local.config.uploaddefault) {
                            if (this.currentImage !== null) {
                                local.config.uploaddefault.value = this.currentImage;
                            }
                        }
                    }
                }

                if (local.value === true && local.config) {
                    params[name] = local.config;
                } else {
                    params[name] = local.value;
                }
            });

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
            disabled: true
        };
    },
    created() {
        if (this.params.library) {
            imageService.getMedia(this.params.library).then(res => {
                this.libraryImages = res.map(image => image.path);
            });
        }
    },
    methods: {
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
            this.showImageEditor = false;
        },
        back() {
            this.page = {
                one: true,
                two: false,
                three: false
            };
        },
        clear() {
            this.page = {
                one: true,
                two: false,
                three: false
            };

            this.currentImage = null;
        },
        setImage(url) {
            if (this.plugin.flexible) {
                this.heightImg(url);
            }

            this.currentImage = url;

            this.page = {
                one: false,
                two: false,
                three: true
            };
        },
        heightImg(url) {
            let img = document.createElement('IMG');

            img.onload = () => {
                this.$refs.wrapperSie.style.height = `${img.height}px`;
            };

            img.src = url;
        },
        saveUrl(event) {
            this.setImage(this.url);
        },
        submitImage(data) {
            this.$store.commit('global/setLoader', true);
            const images = this.searchStateImages(data.state);
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
        submit() {
            this.$refs.sie.save();
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
                property: 'placeholder',
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
        searchStateImages(data) {
            const urlKeys = this.getObjectKeys(data.preset).filter(key => {
                return key.includes('url');
            });
            const images = [];
            urlKeys.forEach(url => {
                const keys = url.split('.');
                const img = this.searchImage(data.preset, keys);
                //I only want to upload images that are base64
                if (
                    typeof img !== 'undefined' &&
                    img !== '' &&
                    this.isDataUrl(img)
                ) {
                    images.push({
                        key: url,
                        image: img
                    });
                }
            });
            return images;
        },
        getObjectKeys(data, prefix = '') {
            return Object.keys(data).reduce((result, element) => {
                if (Array.isArray(data[element])) {
                    return result;
                } else if (
                    data[element] !== null &&
                    typeof data[element] === 'object'
                ) {
                    return [
                        ...result,
                        ...this.getObjectKeys(
                            data[element],
                            prefix + element + '.'
                        )
                    ];
                } else {
                    return [...result, prefix + element];
                }
            }, []);
        },
        searchImage(data, keys) {
            let subData = data;
            keys.forEach(key => {
                subData = subData[key];
            });
            return subData;
        },
        isDataUrl(url) {
            const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
            return !!RegExp(regex).test(url);
        }
    },
    mounted() {
        if (Object.keys(this.plugin.data).length > 0) {
            this.page = {
                one: false,
                two: false,
                three: true
            };
        }
        this.$refs.input.addEventListener('change', event => {
            this.setImage(window.URL.createObjectURL(event.target.files[0]));
        });
    }
};
</script>
<style lang="less" scoped>
#master-image-editor {
    padding-top: 0px !important;
    .modal-wrapper {
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        .modal-body {
            height: auto;
            max-height: none;
        }
    }
}
.page-1 {
    max-width: 680px;
    .modal-body {
        padding: 50px 70px !important;
        margin-bottom: 0px;
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