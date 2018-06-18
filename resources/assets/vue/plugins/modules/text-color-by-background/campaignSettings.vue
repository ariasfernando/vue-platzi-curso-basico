<template></template>

<script>
  import _ from 'lodash';
  import contrast from 'contrast';

  export default {
    props: ['name', 'plugin', 'columnId'],
    computed: {
      currentModule() {
        return this.$store.getters["campaign/currentModule"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentModule];
      },
      bgcolor() {
        return this.module.structure.columns[this.columnId].container.attribute.bgcolor;
      },
    },
    watch: {
      bgcolor(bgcolor) {
        const color = contrast(bgcolor) === 'light' ? this.plugin.config.darkText : this.plugin.config.lightText;

        // Loop through columns and components
        _.each(this.module.structure.columns[this.columnId].components, (comp, compId) => {
          const subComponent = comp.type.split('-')[0];
          // Set new text color
          if (subComponent === 'button' || subComponent === 'text') {
            this.$store.commit('campaign/saveComponentProperty', {
              moduleId: this.currentModule,
              columnId: this.columnId,
              componentId: compId,
              subComponent,
              link: 'style',
              property: 'color',
              value: color,
            })
          }
        });
      }
    },
  }
</script>
