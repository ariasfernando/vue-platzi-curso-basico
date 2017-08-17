<template>

</template>

<script>

  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    data() {
      return {}
    },
    created() {
      const options = _.filter(this.plugin.data.options, 'value');
      let toolbar = [];

      if (toolbar.length) {
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
            const parts = this.id.split('-');

            this.$store.dispatch('campaign/updateElement', {
              moduleId: parts[1],
              columnId: parts[2],
              componentId: parts[3],
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
</script>