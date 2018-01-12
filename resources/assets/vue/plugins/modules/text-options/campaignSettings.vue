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
    mounted() {
      this.initTinyMCE();
    },
    methods: {
      initTinyMCE() {
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
          fixed_toolbar_container: `.toolbar-${editorId}`,
          document_base_url: Application.globals.cdnHost + "/js/tinymce/",
          skin: 'lightgray',
          skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
          toolbar: toolbar,
          plugins: 'paste advlist autolink lists stlinkextended textcolor sttextcolorextended',
          inline: true,
          menubar: false,
          link_validate_url: true,
          link_title: false,
          link_text_to_display: false,
          paste_as_text: true,
          forced_root_block :false,
          target_list: false,
          invalid_elements:'img',
          link_validate_url:true,
          data_description:true,
          paste_as_text:true,
          relative_urls: false,
          textcolor_rows: 1,

          init_instance_callback: (editor) => {

            editor.on('blur', (e) => {
              this.$store.commit('campaign/updateElement', {
                moduleId: this.currentComponent.moduleId,
                columnId: this.currentComponent.columnId,
                componentId: this.currentComponent.componentId,
                data: {
                  text: editor.getContent()
                } 
              });
            });
          },

          setup: function(editor) {
            editor.on('focus', function(e) {
                
                // Change icon tiny
                // TODO  implement DRY.
                let $toolbox = $(editor.settings.fixed_toolbar_container);

                if( $toolbox.length && !$toolbox.find("div[aria-label='Font Sizes'] .text-size").length ){
                    setTimeout(function(){
                        $toolbox.find('div[aria-label="Font Sizes"] button:first').empty();
                        $toolbox.find('div[aria-label="Font Sizes"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
                    }, 100);
                };
                if( $toolbox.length && !$toolbox.find("div[aria-label='Font Family'] .text-size").length ){
                    setTimeout(function(){
                        $toolbox.find('div[aria-label="Font Family"] button:first').empty();
                        $toolbox.find('div[aria-label="Font Family"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
                    }, 100);
                };
                
            });

            editor.on('init', (e) => {
              // Set focus on first click
              editor.focus();
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
      },
      destroyed () {
        tinymce.get(editorId).destroy();
      }
    }
  }
</script>