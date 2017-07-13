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
            editor.on('KeyUp', (e) => {
              this.$emit('input', editor.getContent());
            });

            editor.on('Change', (e) => {
              this.$emit('input', editor.getContent());
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
