<template>
  <div class="settings-wrapper plugin-wrapper" v-if="component">

    <div class="plugin-wrapper-inner">
      <span>
        <button @click="showImageEditor = true"><i class="glyphicon glyphicon-cloud-upload"></i> Update Image</button>
      </span>
    </div>

    <div class="plugin-wrapper-inner">
      <span>
        <label>Alt</label>
        <input :value="component.attribute.alt" ref="imageAlt" type="text" class="image-alt-text" placeholder="Alt text" @input="updateField('imageAlt')">
      </span>
    </div>

    <image-editor-modal
      v-if="showImageEditor"
      :params="params"
      :data="plugin.data"
      @update-data="updatePluginData"
      @image-submit="submitImage"
      @close="showImageEditor = false">
    </image-editor-modal>
  </div>
</template>

<script>
import _ from 'lodash';
import ImageEditorModal from 'stensul-sie-vue';
import imageService from '../../../services/image';

export default {
    props: ['name', 'plugin'],
    components: {
        ImageEditorModal
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

            _.each(this.plugin.config, (option, key) => {
                if (option.value === true && option.config) {
                    params[key] = option.config;
                } else {
                    params[key] = option.value;
                }
            });

            return params;
        }
    },
    data() {
        return {
            showImageEditor: false,
            libraryImages: []
        };
    },
    created() {
        if (this.params.library) {
            imageService.getMedia(this.params.library).then(res => {
                this.params.libraryImages = res.map(image => image.path);
            });
        }
    },
    methods: {
        removeErrorsImages() {
            let $contentImgError = $('.stx-module-wrapper-active').find(
                '.default-image-error'
            );

            if ($contentImgError.length > 0) {
                $contentImgError.removeClass('default-image-error');
            }
        },
        searchImage(data, keys) {
            let subData = data;
            keys.forEach(key => {
                subData = subData[key];
            });
            return subData;
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
        isDataUrl(url) {
            const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
            return !!RegExp(regex).test(url);
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
                attribute: 'placeholder',
                attributeValue: image
            };

            this.$store.commit('campaign/saveComponentAttribute', payload);
        },
        updateField(field) {
            const value = this.$refs[field].value;

            const payload = {
                plugin: this.name,
                moduleId: this.currentComponent.moduleId,
                columnId: this.currentComponent.columnId,
                componentId: this.currentComponent.componentId,
                attribute: 'alt',
                attributeValue: value
            };

            this.$store.commit('campaign/saveComponentAttribute', payload);
        }
    }
};
</script>