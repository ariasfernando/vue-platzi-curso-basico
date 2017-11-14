<template>
  <div class="plugin-wrapper-inner">
    <label>Select an image</label>
    <div class="plugin-upload">
      <label for="upload-image" class="upload-image-trigger">
        <i class="glyphicon glyphicon-cloud-upload"></i>
      </label>
      <input type="file" @change="onFileChange" id="upload-image">
      <span class="upload-image-filename" id="upload-image-filename">No file chosen</span>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;  

        if (!files.length)
          return;
        
        this.createImage(files[0]);
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;

        reader.onload = (e) => {
          vm.image = e.target.result;

          // Upload Image
          this.$store.dispatch('campaign/uploadImages', {
            images: [ vm.image ],
            campaignId: this.campaign.campaign_id
          }).then((res) => {
            this.updateAttribute(res[0]);
          });
        };

        reader.readAsDataURL(file);

      },
      updateAttribute(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'placeholder',
          attributeValue: e
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    }
  }
</script>