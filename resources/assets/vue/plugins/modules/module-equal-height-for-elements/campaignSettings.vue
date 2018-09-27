<template>
</template>

<script>
import pluginMixinCampaign from '../mixins/pluginMixinCampaign';

export default {
  mixins: [pluginMixinCampaign],
  methods:{
    getHigherHeight(components) {
      const moduleIdInstance = this.moduleIdInstance;
      const buildingMode = this.buildingMode
      let higherHeight = 0;
      let $item;
      _.each(components, (component) => {
        const selector = `[module-id-instance="${moduleIdInstance}"] [component-id="${component}"] table:first`;
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
      let minHeight = this.getHigherHeight(components);
      _.each(components, (componentId) => {
          this.saveHeight(componentId, minHeight)
          this.addClassToComponent(componentId, 'st-equal-height')
        });
      });
    },
  },
  mounted() {
    this.setEqualHeights();
  },
  watch: {
      module: {
        handler: function() {
          this.setEqualHeights();
          if (this.buildingMode === 'mobile') {
            $('#shadowRender')[0].dispatchEvent(new Event("update-iframe"));
          }
        },
        deep: true
      }
  }
};
</script>
