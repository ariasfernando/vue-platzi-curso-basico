<template>
</template>

<script>
export default {
  props: ['name', 'module', 'plugin', 'moduleId'],
  data() {
    return {
      previousHeight: 0
    };
  },
  computed: {
    isCustom() {
      return this.module.type === 'custom';
    },
    buildingMode() {
      return this.$store.getters['campaign/buildingMode'];
    },
    iframe() {
      return document.getElementById('shadowRender');
    }
  },
  methods: {
    saveModuleAttribute(property, value, columnId) {
      const payload = {
        moduleId: this.moduleId,
        columnId
      };
      if (this.isCustom) {
        payload.plugin = this.name;
        payload.data = {};
        payload.data[property] = value;
        this.$store.commit('campaign/saveCustomModuleData', payload);
      } else {
        payload.subComponent = 'container';
        payload.link = 'attribute';
        payload.property = property;
        payload.value = value;
        this.$store.commit('campaign/saveModuleProperty', payload);
      }
    },
    setModuleHeight() {
      setTimeout(() => {
        const height = this.getHeight();
        if (height !== this.previousHeight) {
          this.saveModuleAttribute('height', height, 0);
          this.previousHeight = height;
        }
      }, 200);
    },
    getHeight() {
      let height = 0;
      if (this.buildingMode === 'desktop') {
        height = $(`[data-module-id="${this.moduleId}"]`).height();
      } else {
        height = $(this.iframe.contentDocument).find(`[data-module-id="${this.moduleId}"]`).height();
      }
      return height;
    }
  },
  watch: {
    module: {
      handler(newModule) {
        if (this.buildingMode === 'mobile') {
          this.iframe.dispatchEvent(new Event('update-iframe'))
        }
        this.setModuleHeight();
      },
      deep: true
    }
  }
};
</script>
