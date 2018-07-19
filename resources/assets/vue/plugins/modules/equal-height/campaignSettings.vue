<template>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['name', 'plugin','moduleId'],
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    module() {
      return this.modules[this.moduleId];
    },
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
      let $itemsToEqualize = $("[data-module-id='" + this.moduleId + "']").find('.st-equal-height > table');
      let higherHeigh = 0;
      $itemsToEqualize.each((index, item) => {
        higherHeigh = Math.max(higherHeigh, $(item).height());
      });
      return higherHeigh;
    },
    setEqualHeights() {
      if(this.module){
        const height = this.getHigherHeight()
        _.each(this.module.structure.columns, (column, columnIndex) => {
          let storageData = {
            moduleId: this.moduleId,
            columnId: columnIndex
          };
          this.saveColumnAttribute('height', height, columnIndex);
        });
      }
    },
    addClassEqualHeight() {
      if(this.module){
        _.each(this.module.structure.columns, (column, columnIndex)  => {
          let classes = column.container.attribute.classes;
          let classesArr = classes ? classes.split(' '): [];
          const index = classesArr.indexOf('st-equal-height');
          if (index === -1) {
            classesArr.push('st-equal-height');
            classes = classesArr.join(' ');
            this.saveColumnAttribute('classes', classes, columnIndex);
          }
        });
      }
    }
  },
  watch: {
    module: {
      handler: function() {
        this.addClassEqualHeight();
        this.setEqualHeights();
      },
      deep: true
    }
  }
};
</script>
