<template>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  name: 'ModuleHeightSync',
  mixins: [pluginCampaignMixin],
  data() {
    return {
      previousHeight: 0,
    };
  },
  computed: {
    isCustom() {
      return this.module.type === 'custom';
    },
    buildingMode() {
      return this.$store.getters['campaign/buildingMode'];
    },
  },
  watch: {
    module: {
      handler() {
        if (this.buildingMode === 'mobile') {
          this.iframe.dispatchEvent(new Event('update-iframe'))
        }
        this.setModuleHeight();
      },
      deep: true,
    },
  },
  mounted() {
    this.setModuleHeight();
  },
  methods: {
    saveModuleAttribute(property, value) {
      if (this.isCustom) {
        const payload = {
          moduleId: this.moduleId,
          plugin: this.name,
          data: {},
        };
        payload.data[property] = value;
        this.$store.commit('campaign/saveCustomModuleData', payload);
      } else {
        this.saveAttributeInThisElement({ property, value });
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
        height = $(`[data-module-id='${this.moduleId}']`).height();
      } else {
        height = $(this.iframe.contentDocument)
          .find(`[data-module-id='${this.moduleId}']`)
          .height();
      }
      return height;
    },
  },
};
</script>
