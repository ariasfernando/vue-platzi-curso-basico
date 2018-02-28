<template>
  <div class="form-group" :class="'field-' + type">
    <div class="col-xs-6">
        <label class="clearfix control-label" for="name">{{ label }}</label>
      <input class="input" :name="name" type="file" @change="onFileChange">
    </div>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "generic-file",
  props: ["element", "name", "type", "link", "label", "default-value"],
  mixins: [SettingMixin],
  methods: {
    resetImage() {
      if (this.link === "style") {
        this.$emit("style-setting-updated", { name: this.name, value: "" });
      } else if (this.link === "styleOption") {
        this.$emit("style-option-setting-updated", { name: this.name, value: "" });
      } else if (this.link === "attribute") {
        this.$emit("attribute-setting-updated", { name: this.name, value: "" });
      }
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
            this.updateAttributePlaceholder("customer/modules" + res[0]);
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