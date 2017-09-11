<template>
  <div>
      <label>Select an image</label>
      <input type="file" @change="onFileChange">
    </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;

        return this.$store.state.campaign.modules[moduleId].structure.columns[columnId].components[componentId];
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
        const image = new Image();
        const reader = new FileReader();
        const vm = this;

        reader.onload = (e) => {
          vm.image = e.target.result;
          this.updateAttribute(vm.image);
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
    },
  }
</script>