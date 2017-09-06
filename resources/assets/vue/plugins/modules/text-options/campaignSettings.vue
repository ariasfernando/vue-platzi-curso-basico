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
        const options = _.filter(this.plugin.data.options, 'value');
        let toolbar = [];

        if (options.length) {
          _.each(options, (option) => {
            toolbar.push(option.key)
          });
          toolbar = toolbar.join(' ');
        } else {
          toolbar = ' ';
        }

        const editorId = ['editor', this.currentComponent.moduleId, this.currentComponent.columnId, this.currentComponent.componentId].join('-');

        let settings = {
          selector: `#${editorId}`,
          document_base_url: Application.globals.cdnHost + "/js/tinymce/",
          skin: 'lightgray',
          skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
          inline: true,
          menubar: false,

          toolbar: toolbar,
          init_instance_callback: (editor) => {

            editor.on('Blur', (e) => {
              this.$store.dispatch('campaign/updateElement', {
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

        tinymce.init(settings);
        tinymce.execCommand('mceFocus', false, editorId);
      }
    }
  }
</script>