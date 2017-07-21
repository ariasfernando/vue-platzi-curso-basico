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
      toolbar: {
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
      this.initTinyMCE(this.options);
    },
    methods: {
      initTinyMCE (params) {
        let options = _.extend({
          selector: `#${this.id}`,
          document_base_url: Application.globals.cdnHost + "/js/tinymce/",
          skin: 'lightgray',
          skin_url: Application.globals.cdnHost + '/css/tinymce/lightgray',
          inline: true,
          menubar: false,
          toolbar: '',
          init_instance_callback: (editor) => {

            editor.on('Blur', (e) => {
              const parts = this.id.split('-');

              this.$store.commit('module/updateElement', {
                moduleId: parts[1],
                columnId: parts[2],
                componentId: parts[3],
                data: {
                  text: editor.getContent()
                }
              });
            });
          }
        }, params);

        tinymce.init(options);
      }
    },
    destroyed () {
      tinymce.get(this.id).destroy();
    }
  }
</script>

<style lang="sass">
  .st-edit-text {
    cursor: text;
  }
</style>
