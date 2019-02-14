<template>
  <div />
</template>

<script>
import contrast from 'contrast';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  mixins: [pluginCampaignMixin],
  computed: {
    bgcolor() {
      return this.element.structure.attribute.bgcolor;
    },
  },
  watch: {
    bgcolor(bgcolor) {
      const value = contrast(bgcolor) === 'light' ? this.plugin.config.darkText : this.plugin.config.lightText;
      // Loop through columns and components
      _.each(this.element.structure.columns, (column, columnId) => {
        _.each(this.element.structure.columns[columnId].components, (comp, compId) => {
          const subComponent = comp.type.split('-')[0];
          // Set new text color
          if (subComponent === 'text') {
            this.saveElementProperty({
              elementId: comp.id,
              subComponent,
              link: 'style',
              property: 'color',
              value,
            });
            // reset tinymce to refresh changes on text
            const editorId = this.getTinyId(this.moduleIdInstance, comp.id);
            setTimeout(() => {
              document.getElementById(editorId).dispatchEvent(new Event('tiny-style-reset'));
            }, 10);
          }
        });
      });
    },
  },
};
</script>
