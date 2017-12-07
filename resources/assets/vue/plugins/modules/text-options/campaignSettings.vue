<template>

</template>

<script>

  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
    },
    watch: {
      currentComponent: {
        handler: function (newComponent) {
          this.initTinyMCE();
        },
        deep: true
      },
    },
    data() {
      return {
        component: {},
      }
    },
    created() {
      this.initTinyMCE();
    },
    methods: {
      initTinyMCE() {
        console.log(this.plugin);
        const options = _.filter(this.plugin.config.options, 'value');
        let toolbar = [];

        if (!_.isEmpty(options)) {
          _.each(options, (option) => {
            toolbar.push(option.key)
          });
          toolbar = toolbar.join(' ');
        } else {
          toolbar = ' ';
        }

        const editorId = ['editor', this.currentComponent.moduleId, this.currentComponent.columnId, this.currentComponent.componentId].join('-');

        const settings = {
          selector: `#${editorId}`,
          document_base_url: Application.globals.cdnHost + "/js/tinymce/",
          skin: 'lightgray',
          skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
          inline: true,
          menubar: false,
          toolbar: toolbar,
          plugins: 'paste advlist autolink lists textcolor stlinkextended sttextcolorextended',

          init_instance_callback: (editor) => {

            editor.on('Blur', (e) => {
              this.$store.commit('campaign/updateElement', {
                moduleId: this.currentComponent.moduleId,
                columnId: this.currentComponent.columnId,
                componentId: this.currentComponent.componentId,
                data: {
                  text: editor.getContent()
                }
              });
            });
          }
        };

        if (!_.isEmpty(options)) {
          _.each(options, (option) => {
            if ( option.key === 'forecolor' && !_.isEmpty(option.textcolor_map) ) {
              settings.plugins = [settings.plugins, 'textcolor'].join(' ');
              settings['textcolor_map'] = option.textcolor_map;
            }
          });
        }

        tinymce.init(settings);
        tinymce.execCommand('mceFocus', false, editorId);
      }
    }
  }
</script>