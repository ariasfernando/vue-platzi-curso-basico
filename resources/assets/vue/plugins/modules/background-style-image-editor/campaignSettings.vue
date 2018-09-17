<template>
  <div class="settings-wrapper plugin-wrapper">
    <settings-container :no-label="true">
      <template slot="setting-bottom">
        <el-button @click="showModal" type="primary">
          <i class="glyphicon glyphicon-cloud-upload"></i>
          Upload Background Image
        </el-button>
      </template>
    </settings-container>
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
import ImageModal from '../../../components/common/ImageModal';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import _ from 'lodash';
import validatorMixin from '../mixins/validator';

export default {
  props: ['name', 'plugin', 'pluginKey', 'moduleId', 'module'],
  mixins: [validatorMixin],
  components: {
    ImageModal,
    SettingsContainer
  },
  data() {
    return {
      showImageEditor: false,
      libraryImages: [],
      overlayImages: [],
      image: {},
      isEdit: false
    };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    }
  },
  methods: {
    close() {
      this.showImageEditor = false;
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
          this.updateProperty('style', 'backgroundImage', uploadedImgs[imgs.length - 1]);
          if (this.plugin.config['background-style-image-editor'].config.backgroundSize){
            this.updateProperty('style', 'backgroundSize', this.plugin.config['background-style-image-editor'].config.backgroundSize);
          }
          if (this.plugin.config['background-style-image-editor'].config.assignHeight){
            this.updateProperty('attribute', 'height', data.state.outputSize.height);
          }
          if (this.plugin.config['background-style-image-editor'].config.addClassEqualHeight){
            this.addClassEqualHeight();
          }
          const temp = {};
          temp.img = data.img;
          temp.state = data.state;
          this.updatePluginData(uploadedImgs, data.images, {
              ...this.plugin.data,
              ...temp
            }, data.newImage);
          this.$store.commit('global/setLoader', false);
          this.showImageEditor = false;
        });
    },
    updatePluginData(uploadedImgs, images, data, newImage) {
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
      delete data.images;
      this.$store.commit('campaign/savePlugin', {
        plugin: this.pluginKey,
        moduleId: this.moduleId,
        data: data
      });
    },
    updateProperty(link, property, value) {
    this.$store.commit('campaign/saveModuleProperty', {
        moduleId: this.moduleId,
        link,
        property,
        value
      });
    },
    addClassEqualHeight() {
      let classes = this.module.structure.attribute.classes;
      let classesArr = classes ? classes.split(' ') : [];
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
            state: temp.state
          };
        }
      }
      this.showImageEditor = true;
    }
  }
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

.el-input /deep/ .el-input__inner {
  border-radius: 2px;
  font-weight: 300;
  padding-left: 8px;
  height: 26px;
  font-size: 12px;

  &:focus {
    border: 1px solid #78dcd6;
  }
}
</style>