<template>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import contrast from 'contrast';

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
      _.each(this.element.structure.rows, (row) => {
        _.each(row.columns, (column) => {
          _.each(column.components, (component) => {
            const subComponent = component.type.split('-')[0];
            // Set new text color
            if (subComponent === 'text') {
              this.saveElementProperty({
                elementId: component.id,
                subComponent,
                link: 'style',
                property: 'color',
                value,
              });
              // reset tinymce to refresh changes on text
              const editorId = this.getTinyId(this.moduleIdInstance, component.id);
              setTimeout(() => {
                document.getElementById(editorId).dispatchEvent(new Event('tiny-style-reset'));
              }, 10);
            }
          });
        });
      });
    },
  },
};
</script>
