<template>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  mixins: [pluginCampaignMixin],
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
      const rowSelector = this.module.structure.rows.length > 1 ? `[data-row-id="${this.element.id}"]` : '';
      const selector = `[module-id-instance="${moduleIdInstance}"] ${rowSelector} [data-column-id] >tr>td>table`;
      let $itemsToEqualize = false;
      if (this.buildingMode === 'desktop') {
        $itemsToEqualize = $(selector);
      } else {
        $itemsToEqualize = $(this.iframe).contents().find(selector);
      }
      let higherHeight = 0;
      $itemsToEqualize.each((index, item) => {
        const columnId = $(item).closest('[data-column-id]').attr('data-column-id');
        const columnHeight = $(item).height() + this.getVerticalBorderAndPadding(columnId);
        higherHeight = Math.max(higherHeight, columnHeight);
      });
      return higherHeight;
    },
    setEqualHeights() {
      setTimeout(() => {
        const higherHeight = this.getHigherHeight();
        if (higherHeight !== this.previousHeight) {
          _.each(this.getElement(this.element.id).columns, (column, columnIndex) => {
            const height = higherHeight - this.getVerticalBorderAndPadding(columnIndex);
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
      _.each(this.row.columns, (column) => {
          this.addClassToElement({ value: 'st-equal-height', elementId: column.id });
      });
    },
    getImagesUrls() {
      const imagesUrls = [];
      for (const columnId in this.row.columns) {
        const column = this.row.columns[columnId];
        for (const componentId in column.components) {
          if (this.row.columns[columnId].components[componentId].type === 'image-element') {
            imagesUrls.push(this.row.columns[columnId].components[componentId].image.attribute.placeholder);
          }
        }
      }
      return imagesUrls;
    },
    setImagesUrls() {
      this.previousImagesUrls = _.cloneDeep(this.getImagesUrls());
    },
    getVerticalBorderAndPadding(columnIndex) {
      const column = this.getElement(this.element.id).columns[columnIndex];
      const verticalPadding = parseInt(column.container.style.paddingTop || 0) + parseInt(column.container.style.paddingBottom || 0);
      const verticalBorder = parseInt(column.container.style.borderTopWidth || 0) + parseInt(column.container.style.borderBottomWidth || 0);
      return verticalPadding + verticalBorder;
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
          this.iframe.dispatchEvent(new Event("update-iframe"))
        }
      },
      deep: true,
    },
  },
};
</script>
