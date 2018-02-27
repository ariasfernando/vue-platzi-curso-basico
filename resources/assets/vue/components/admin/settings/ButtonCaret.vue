<template>
  <div class="form-group field-font-style">
    <label class="col-sm-6 control-label">Button caret</label>
    <div class="col-sm-6 position-relative">
      <i v-if="buttonCaret" class="glyphicon glyphicon-trash st-remove" @click="resetImage"></i>
      <input class="input" name="buttonCaret" type="file" @change="onFileChange">
    </div>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "ButtonCaret",
  props: ["setting"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "buttonCaret"
    };
  },
  computed: {
    buttonCaret() {
      return this.component.attribute[this.name];
    }
  },
  methods: {
    resetImage() {
      this.$emit("attribute-setting-updated", { name: this.name, value: "" });
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
        this.$emit("attribute-setting-updated", { name: this.name, value: e });
      };

      tmp.onerror = () => {
        // Retry to load image
        this.updateAttributePlaceholder(e);
      };
    }
  }
};
</script>

<style lang="less" scoped>
.field-button-caret {
  input {
    display: inline;
    width: 80px !important;
  }

  i.st-remove {
    cursor: pointer;
  }
}
</style>
