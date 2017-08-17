<template>
  <div class="st-edit-text" :id="id" v-html="value"></div>
</template>

<script>
  import _ from 'underscore-contrib'

  export default {
    name: 'TinyMce',
    props: {
      id: {
        type: String,
        default: 'editor'
      },
      value: {
        type: String,
        default: ''
      },
      menubar: {
        default: ''
      },
      options: {
        default: ''
      },
    },
    mounted () {
      this.initTinyMCE();
    },
    computed: {
      toolbar() {
        return this.$store.getters["campaign/editorToolbar"];
      },
    },
    methods: {
      initTinyMCE () {
        let options = {
          selector: `#${this.id}`,
          document_base_url: Application.globals.cdnHost + "/js/tinymce/",
          skin: 'lightgray',
          skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
          inline: true,
          menubar: false,
          toolbar: this.toolbar,
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

        tinymce.init(options);
      }
    },
    destroyed () {
      tinymce.get(this.id).destroy();
    }
  }
</script>
