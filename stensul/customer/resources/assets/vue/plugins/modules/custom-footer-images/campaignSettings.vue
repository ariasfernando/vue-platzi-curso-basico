<!-- eslint-disable-next-line -->
<template></template>

<script>
import contrast from 'contrast';
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';

const DEFAULT_IMAGES_TYPE = ['Blk', 'Wht'];

export default {
  mixins: [pluginCampaignMixin],
  computed: {
    moduleBackgroundColor() {
      return this.module.structure.attribute.bgcolor;
    },
  },
  watch: {
    moduleBackgroundColor() {
      const backgroundContrast = contrast(this.moduleBackgroundColor);
      this.updateImages(backgroundContrast);
    },
  },
  methods: {
    updateImages(backgroundContrast) {
      this.plugin.config.images.forEach((item) => {
        const element = this.getElement(item.id);
        if (this.hasDefaultImage(element.image.attribute.placeholder)) {
          this.saveElementProperty({
            elementId: element.id,
            subComponent: 'image',
            link: 'attribute',
            property: 'placeholder',
            value: backgroundContrast === 'light' ? item.lightUrl : item.darkUrl,
          });
        }
      });
    },
    hasDefaultImage(url) {
      if (url.indexOf(DEFAULT_IMAGES_TYPE[0]) > -1 || url.indexOf(DEFAULT_IMAGES_TYPE[1]) > -1 || url === '') {
        return true;
      }
      return false;
    },
  },
};
</script>
