<template>
  <settings-container label="Button caret">
    <template slot="setting-right">
      <i v-if="caret" class="glyphicon glyphicon-trash st-remove" @click="resetImage"></i>
      <input class="input" name="caret" type="file" @change="onFileChange">
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "ButtonCaret",
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  data() {
    return {
      linkName: "url",
    };
  },
  computed: {
    caret() {
      return this.element.attribute[this.linkName];
    }
  },
  methods: {
    resetImage() {
      this.$emit("setting-updated", {
        link: 'attribute',
        subComponent: this.subComponent,
        name: this.linkName,
        value: undefined
      });
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
        this.$emit("setting-updated", {
        link: 'attribute',
        subComponent: this.subComponent,
        name: this.linkName,
        value: e });
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
input {
  width: 80px;
}

i.st-remove {
  cursor: pointer;
}
</style>
