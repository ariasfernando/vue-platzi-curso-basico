<template>
  <settings-container v-if="showSetting" :no-label="true">
    <template slot="setting-bottom">
      <stui-button
        type="gray"
        width="full"
        @click="trigger">
        {{ label }}
      </stui-button>
      <div v-if="fileName" class="file-name">
        Uploaded file: {{ fileName }}
      </div>
      <input
        ref="fileInput"
        class="is-hidden"
        :name="name"
        type="file"
        @change="onFileChange">
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'GenericFile',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      fileName: '',
    };
  },
  methods: {
    resetImage() {
      this.$emit('setting-updated', {
        link: this.link,
        name: this.name,
        value: '' });
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;

      if (!files.length) return;

      this.createImage(files[0]);
      this.fileName = files[0].name;
    },
    createImage(file) {
      const reader = new FileReader();
      const vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;

        // Upload Image
        this.$store
          .dispatch('module/uploadImages', {
            images: [vm.image],
          })
          .then(res =>
            this.updateAttributePlaceholder(this.$_app.config.imagePathStudio + res[0]),
          );
      };

      reader.readAsDataURL(file);
    },
    updateAttributePlaceholder(e) {
      // Set the src after we have loaded the new image
      const tmp = new Image();
      tmp.src = this.$_app.config.imageUrl + e;

      tmp.onload = () => {
        this.mainSetting = e;
      };

      tmp.onerror = () => {
        // Retry to load image
        this.updateAttributePlaceholder(e);
      };
    },
    trigger() {
      this.$refs.fileInput.click();
    },
  },
};
</script>
<style lang="scss" scoped>
.is-hidden {
  display: none;
}
.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 4px;
  font-size: 10px;
  max-width: 240px;
  white-space: nowrap;
}
</style>
