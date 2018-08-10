<template>
    <iframe v-if="isRenderIframe" id="shadowRender" @update-iframe="updateIframe"></iframe>
</template>

<script>
// This component are in BETA version.
// The render HAS NO HEAD.
// The plugins that use it should updateIframe() it when it is necessary.
// For a work correct in the plugin need a timeout for get the new render.
import _ from 'lodash';
export default {
  name:'shadow-render',
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    isRenderIframe() {
      let render = false;
      _.each(this.modules, (module, moduleIndex) => {
        _.each(module.plugins, (plugin, pluginKey) => {
          if (this.isRenderSetting(plugin, pluginKey)) {
            render = true;
          }
        });
        _.each(module.structure.columns, (column, columnIndex) => {
          _.each(column.plugins, (plugin, pluginKey) => {
            if (this.isRenderSetting(plugin, pluginKey)) {
              render = true;
            }
          });
          _.each(column.components, (component, componentIndex) => {
            _.each(component, (plugin, pluginKey) => {
              if (this.isRenderSetting(plugin, pluginKey)) {
                render = true;
              }
            });
          });
        });
      });
      return render;
    }
  },
  methods: {
    isRenderSetting(plugin, key) {
      return plugin.enabled && plugin.needShadowRender;
    },
    setHtml(html) {
      $('#shadowRender').contents().find('body').html(html);
    },
    updateIframe(){
      setTimeout(() => {
        let html = $('table#emailCanvas').clone();
        html.find('.st-remove-element').remove();
        html = Application.utils.removeWrappers(html);
        html = html[0].outerHTML
        this.setHtml(html);
      }, 100);
    }
  },
};
</script>
<style scoped>
iframe#shadowRender {
  opacity: 0;
  position: fixed;
  left: 110%;
  height: 0;
  width: 0;
  border: 0;
}
</style>
