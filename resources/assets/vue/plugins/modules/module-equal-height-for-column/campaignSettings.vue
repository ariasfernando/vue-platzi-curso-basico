<template>
</template>

<script>
import pluginGenericCampaignMixin from '../mixins/pluginGenericCampaignMixin';
import pluginElementCampaignMixin from '../mixins/pluginElementCampaignMixin';

export default {
  mixins: [pluginGenericCampaignMixin, pluginElementCampaignMixin],
  data() {
    return {
      previousImagesUrls: [],
      previousHeight: 0,
      subComponent: 'container',
    };
  },
  methods: {
    getHigherHeight() {
      const moduleIdInstance = this.moduleIdInstance;
      const selector = `[module-id-instance="${moduleIdInstance}"] .st-equal-height > table`;
      let $itemsToEqualize = false;
      if (this.buildingMode === 'desktop') {
        $itemsToEqualize = $(selector);
      } else {
        $itemsToEqualize = $('#shadowRender').contents().find(selector);
      }
      let higherHeight = 0;
      $itemsToEqualize.each((index, item) => {
        const columnId = $(item).closest('[data-column-id]').attr('data-column-id');
        const columnHeight = $(item).height() + this.getPaddingTopAndBottom(columnId);
        higherHeight = Math.max(higherHeight, columnHeight);
      });
      return higherHeight;
    },
    setEqualHeights() {
      setTimeout(() => {
        const higherHeight = this.getHigherHeight();
        if (higherHeight !== this.previousHeight) {
          _.each(this.module.structure.columns, (column, columnIndex) => {
            const height = higherHeight - this.getPaddingTopAndBottom(columnIndex);
            this.saveElementProperty({
              elementId: column.id,
              link: 'attribute',
              property: 'height',
              value: height,
            });
            this.previousHeight = higherHeight;
          });
        }
      }, 200);
    },
    setEqualHeightsWithImages(url) {
      const tmpImg = new Image();
      tmpImg.src = this.$_app.config.imageUrl + url;
      tmpImg.onload = () => {
        this.setEqualHeights();
      };
    },
    addClassEqualHeight() {
      _.each(this.module.structure.columns, (column) => {
          this.addClassToElement({ value: 'st-equal-height', elementId: column.id });
      });
    },
    getImagesUrls(module) {
      const imagesUrls = [];
      for (const columnId in module.structure.columns) {
        const column = module.structure.columns[columnId];
        for (const componentId in column.components) {
          if (module.structure.columns[columnId].components[componentId].type === 'image-element') {
            imagesUrls.push(module.structure.columns[columnId].components[componentId].image.attribute.placeholder);
          }
        }
      }
      return imagesUrls;
    },
    setImagesUrls() {
      this.previousImagesUrls = _.cloneDeep(this.getImagesUrls(this.module));
    },
    getPaddingTopAndBottom(columnIndex) {
      const column = this.module.structure.columns[columnIndex];
      const padding = parseInt(column.container.style.paddingTop || 0) + parseInt(column.container.style.paddingBottom || 0);
      return padding;
    },
  },
  mounted() {
    this.setImagesUrls();
    this.addClassEqualHeight();
    this.setEqualHeights();
  },
  watch: {
    module: {
      handler: function (newModule) {
        const newImagesUrls = this.getImagesUrls(newModule);
        if (this.previousImagesUrls.length > 0) {
          for (let i = 0; i < this.previousImagesUrls.length; i++) {
            if (this.previousImagesUrls[i] === newImagesUrls[i]) {
              this.setEqualHeights();
            } else {
              this.setEqualHeightsWithImages(newImagesUrls[i]);
              this.setImagesUrls();
            }
          }
        } else {
          this.setEqualHeights();
        }

        if (this.buildingMode === 'mobile') {
          $('#shadowRender')[0].dispatchEvent(new Event("update-iframe"))
        }
      },
      deep: true,
    },
  },
};
</script>
