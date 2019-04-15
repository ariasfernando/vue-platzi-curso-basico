<template>
  <div />
</template>

<script>
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';

export default {
  mixins: [pluginCampaignMixin],
  methods: {
    validateComponent() {
      const backgroundPlugin = this.module.plugins.backgroundStyleImageEditor;
      if (backgroundPlugin.enabled && backgroundPlugin.data.img === undefined) {
        throw new Error('Invalid background image.');
      }
    },
  },
};
</script>
