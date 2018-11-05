<template>
  <settings-container :label="label" v-if="showSetting">
    <template slot="setting-right">
      <input class="input" :name="name" type="file" @change="onFileChange">
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "generic-file",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  methods: {
    resetImage() {
      this.$emit("setting-updated", { link: this.link, name: this.name, value: "" });
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;

      if (!files.length) return;

      this.createImage(files[0]);
    },
    createImage(file) {
      const reader = new FileReader();
      const vm = this;

      reader.onload = e => {
        vm.image = e.target.result;

        // Upload Image
        this.$store
          .dispatch("module/uploadImages", {
            images: [vm.image]
          })
          .then(res => {
            this.updateAttributePlaceholder(this.$_app.config.imagePathStudio + res[0]);
          });
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
    }
  }
};
</script>
<style lang="scss" scoped>
input.input {
  margin-top: 8px;
  width: 100%;
}
</style>
