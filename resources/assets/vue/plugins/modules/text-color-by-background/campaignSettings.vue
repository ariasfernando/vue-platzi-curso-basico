

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
          if (subComponent === 'text') {
            this.$store.commit('campaign/saveComponentProperty', {
              moduleId: this.currentModule,
              columnId: this.columnId,
              componentId: compId,
              subComponent,
              link: 'style',
              property: 'color',
              value: color,
            })
            
            // reset tinymce to refresh changes on text
            const editorId = ['editor', this.module.idInstance, this.columnId, compId].join('-');
            setTimeout(() => {
              document.getElementById(editorId).dispatchEvent(new Event("tiny-style-reset"));
            }, 10);
          }
        });
      }
    },
  }
</script>
