<template>
  <div>
    <label class="col-sm-6 control-label">Button caret</label>
    <div class="col-sm-6 position-relative">
      <i v-if="buttonCaret" class="glyphicon glyphicon-trash st-remove" @click="resetImage"></i>
      <input class="input" name="buttonCaret" type="file" @change="onFileChange">
    </div>
  </div>
</template>

<script>

  export default {
    name: 'ButtonCaret',
    props: ['setting'],
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      buttonCaret() {
        const module = this.$store.getters["module/module"];
        const component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];

        return component.attribute.buttonCaret;
      },
    },
    methods: {
      resetImage() {
        this.$store.commit('module/saveComponentAttribute',{
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'buttonCaret',
          attributeValue: ''
        });
      },
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
          this.$store.dispatch('module/uploadImages', {
            images: [ vm.image ],
          }).then((res) => {
            this.updateAttributePlaceholder('customer/modules' + res[0]);
          });
        };

        reader.readAsDataURL(file);
      },
      updateAttributePlaceholder(e) {
        // Set the src after we have loaded the new image
        const tmp = new Image();
        tmp.src = this.$_app.config.imageUrl + e;

        tmp.onload = () => {
          this.$store.commit('module/saveComponentAttribute', {
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            attribute: 'buttonCaret',
            attributeValue: e
          });
        };

        tmp.onerror = () => {
          // Retry to load image
          this.updateAttributePlaceholder(e);
        };
      },
    }
  }
</script>

<style lang="less">
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
