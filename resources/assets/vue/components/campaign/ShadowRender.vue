<template>
    <iframe v-if="isRenderIframe" id="shadowRender" @update-iframe="updateIframe"></iframe>
</template>

<script>
// The plugins that use it should updateIframe() it when it is necessary.
// For a work correct in the plugin need a timeout for get the new render.
import _ from 'lodash';
export default {
  name:'shadow-render',

  data() {
      return {
        headEmail : '',
      };
  },
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'];
    },
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
        if(module.structure){
          _.each(module.structure.columns, (column, columnIndex) => {
            _.each(column.plugins, (plugin, pluginKey) => {
              if (this.isRenderSetting(plugin, pluginKey)) {
                render = true;
              }
            });
            _.each(column.components, (component, componentIndex) => {
              _.each(component.plugins, (plugin, pluginKey) => {
                if (this.isRenderSetting(plugin, pluginKey)) {
                  render = true;
                }
              });
            });
          });
        }
      });
      if(!this.headEmail) {
        this.setHeadEmail();
      }
      return render;
    }
  },
  methods: {
    setHeadEmail () {
      let url = "/template/email-preview/" + this.campaign.campaign_id + '?no_body=true';

        var request = Application.utils.doAjax(url, {type :'GET', dataType: "html", data: {campaign_id: this.campaign.campaign_id}});
        let _this = this;
        // Ajax: On Success
        request.done(function(response){
          _this.headEmail = response;
        });

        // Ajax: On Fail
        request.fail(function(jqXHR){
        });
    },
    isRenderSetting(plugin, key) {
      return plugin.enabled && plugin.needShadowRender;
    },
    updateIframe(){
      setTimeout(() => {
        let html = $('table#emailCanvas').clone();
        html.find('.st-remove-element').remove();
        html = Application.utils.removeWrappers(html);
        this.headEmail
          ? (html = this.headEmail.replace('</body>', html[0].outerHTML + '</body>'))
          : (html = html[0].outerHTML);
        document.getElementById('shadowRender').contentWindow.document.open();
        document.getElementById('shadowRender').contentWindow.document.write(html);
        document.getElementById('shadowRender').contentWindow.document.close();
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
  width: 1000px;
  border: 0;
}
</style>
