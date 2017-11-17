<template>
  <div class="settings-wrapper plugin-wrapper">

    <div class="plugin-wrapper-inner">
      <span>
        <button @click="showImageEditor = true"><i class="glyphicon glyphicon-cloud-upload"></i> Upload Image</button>
      </span>
    </div>

    <div class="plugin-wrapper-inner">
      <span>
        <label>Alt</label>
        <input :value="component.attribute.alt" ref="imageAlt" type="text" class="image-alt-text" placeholder="Alt text" @input="updateField('imageAlt')">
      </span>
    </div>

    <image-editor-modal v-if="showImageEditor" :params="params()" :data="plugin.data"
                        @update-data="updatePluginData" @image-submit="submitImage" @close="showImageEditor = false">
    </image-editor-modal>
  </div>
</template>

<script>
  import _ from 'lodash';
  import ImageEditorModal from 'stensul-image-editor';

  export default {
    props: ['name', 'plugin'],
    components: {
      ImageEditorModal
    },
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
        showImageEditor: false,
        params() {
          const params = {};

          _.each(this.plugin.data.options, (option, key) => {
            params[key] = option.value;
          });

          return params;
        },
      }
    },
    methods: {
      submitImage(data) {
        this.$store.commit("global/setLoader", true);
        this.$store.dispatch('campaign/uploadImages', {
          images: [ data.imageUrl, data.rawImage ],
          campaignId: this.campaign.campaign_id
        }).then((images) => {
          this.updateAttribute(images[0]);
          this.updatePluginData(images, data);
          this.$store.commit("global/setLoader", false);
          this.showImageEditor = false;
        });
      },
      updatePluginData(images, data) {

        const newData = {
          ...data,
          imageUrl: images[0],
          rawImage: images[1]
        };

        this.$store.commit('campaign/savePlugin', {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: newData
        });
      },
      updateAttribute(image) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'placeholder',
          attributeValue: image,
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
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);


      },
    }
  }
</script>