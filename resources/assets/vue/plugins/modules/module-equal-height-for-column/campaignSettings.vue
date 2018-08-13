<template>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['name', 'plugin', 'moduleId'],
  data () {
    return {
      previousImagesUrls: [],
      previousHeight: 0
    }
  },
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    module() {
      return this.modules[this.moduleId];
    },
    buildingMode() {
      return this.$store.getters['campaign/buildingMode'];
    }
  },
  methods: {
    saveColumnAttribute(property, value, columnId) {
      const payload = {
        moduleId: this.moduleId,
        columnId,
        subComponent: 'container',
        link: 'attribute',
        property,
        value
      };
      this.$store.commit('campaign/saveColumnProperty', payload);
    },
    getHigherHeight() {
      let $itemsToEqualize;
      if (this.buildingMode === 'desktop') {
        $itemsToEqualize = $("[data-module-id='" + this.moduleId + "']").find('.st-equal-height > table');
      } else {
        $itemsToEqualize = $('#shadowRender').contents().find(`[data-module-id='${this.moduleId}']`).find('.st-equal-height > table');
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
        if(higherHeight != this.previousHeight){
          _.each(this.module.structure.columns, (column, columnIndex) => {
            const height = higherHeight - this.getPaddingTopAndBottom(columnIndex);
            this.saveColumnAttribute('height', height, columnIndex);
            this.previousHeight = higherHeight;
          });
        }
      }, 200);
    },
    setEqualHeightsWithImages(url) {
      var tmpImg = new Image() ;
      tmpImg.src = this.$_app.config.imageUrl + url;
      tmpImg.onload = () => {
          this.setEqualHeights();
      };
    },
    addClassEqualHeight() {
      _.each(this.module.structure.columns, (column, columnIndex) => {
        let classes = column.container.attribute.classes;
        let classesArr = classes ? classes.split(' ') : [];
        const index = classesArr.indexOf('st-equal-height');
        if (index === -1) {
          classesArr.push('st-equal-height');
          classes = classesArr.join(' ');
          this.saveColumnAttribute('classes', classes, columnIndex);
        }
      });
    },
    getImagesUrls(module){
      let imagesUrls = [];
      for (let columnId in module.structure.columns) {
        let column = module.structure.columns[columnId];
        for (let componentId in column.components) {
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
    }
  },
  mounted() {
    this.setImagesUrls();
    this.addClassEqualHeight();
    this.setEqualHeights();
  },
  watch: {
    module: {
      handler: function(newModule) {

          let newImagesUrls = this.getImagesUrls(newModule);

          if(this.previousImagesUrls.length > 0){
            for(let i=0; i < this.previousImagesUrls.length; i++){
              if(this.previousImagesUrls[i] === newImagesUrls[i]){
                this.setEqualHeights();
              }else{
                this.setEqualHeightsWithImages(newImagesUrls[i]);
                this.setImagesUrls();
              }
            }
          }else{
            this.setEqualHeights();
          }

          if (this.buildingMode === 'mobile') {
            $('#shadowRender')[0].dispatchEvent(new Event("update-iframe"))
          }
      },
      deep: true
    }
  }
};
</script>
