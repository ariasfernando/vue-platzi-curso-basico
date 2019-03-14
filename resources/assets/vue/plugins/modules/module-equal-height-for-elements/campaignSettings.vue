<template>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  mixins: [pluginCampaignMixin],
  data() {
    return {
      subComponent: 'container',
    };
  },
  watch: {
    module: {
      handler() {
        this.setEqualHeights();
        if (this.buildingMode === 'mobile') {
          $('#shadowRender')[0].dispatchEvent(new Event('update-iframe'));
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.setEqualHeights();
  },
  methods: {
    getHigherHeight(components) {
      const moduleIdInstance = this.moduleIdInstance;
      const buildingMode = this.buildingMode;
      let higherHeight = 0;
      let $item = false;
      _.each(components, (elementId) => {
        const selector = `[module-id-instance='${moduleIdInstance}'] [element-id='${elementId}'] table:first`;
        if (buildingMode === 'desktop') {
          $item = $(selector);
        } else {
          $item = $('#shadowRender').contents().find(selector);
        }
        higherHeight = Math.max(higherHeight, $item.height());
      });
      return higherHeight;
    },
    setEqualHeights() {
      _.each(this.plugin.config.groups, (components) => {
        const minHeight = this.getHigherHeight(components);
        _.each(components, (elementId) => {
          this.saveHeight({ elementId, value: minHeight });
          this.addClassToElement({ value: 'st-equal-height', elementId });
        });
      });
    },
  },
};
</script>
