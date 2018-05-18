<template>
  <div class="cta-text-wrapper stx-edit-text" :id="id" v-html="value" style="display: inline-block;"></div>
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
      settings: {
        default: ''
      }
    },
    mounted () {
      this.initTinyMCE(this.options);
    },
    watch:{
      settings: {
        handler: function(moduleId) {
          return this.initTinyMCE(this.options);
        },
        deep: true
      },
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
          toolbar: 'undo redo | alignleft aligncenter alignright | bold italic underline | link | forecolor backcolor',
          plugins: 'paste advlist autolink lists textcolor link',
          link_validate_url: true,
          link_title: false,
          link_text_to_display: false,
          paste_as_text: true,
          max_chars: this.settings.truncate ? this.settings.truncate.content : undefined,
          max_lines: this.settings.lines_limit ? this.settings.lines_limit.content : undefined,
          forced_root_block : 'p',
          init_instance_callback: (editor) => {

            editor.on('blur', (e) => {
              const parts = this.id.split('-');

              this.$store.commit('module/updateElement', {
                columnId: parts[1],
                componentId: parts[2],
                data: {
                  text: editor.getContent()
                }
              });


            });
          },
          setup: (editor) => {
            let tinyMaxLines = +editor.settings.max_lines;
            let tinyLength, tinyText;

            editor
              .on('keydown',(e) => {
                if( !(this.settings.truncate && this.settings.truncate.content)){
                  //if truncate is NAN, returns and avoid validations
                  return
                }
                tinyLength = editor.getContent({format: 'text'}).length;
                let $textElement = $('#'+tinyMCE.activeEditor.id);
                //let hasError = $textElement.$root.$toast('Error', {className: 'et-error'});

                const allowKeys = [
                  //  key      keyCode
                    'Backspace',    8,
                    'Delete',      46,
                    'Tab',          9,
                    'Escape',      27,
                    'Home',        36,
                    'End',         35,
                    'ArrowLeft',   37,
                    'ArrowRight',  39,
                    'ArrowUp',     38,
                    'ArrowDown',   40
                ];

                let code = null;
                if (e.key !== undefined) {
                    code = e.key;
                } else if (e.keyCode !== undefined) {
                    code = e.keyCode;
                }

                if ($.inArray(code, allowKeys) !== -1 ||
                    // Allow: Ctrl+A,Ctrl+C, Ctrl+X
                    ((e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 88) && (e.ctrlKey === true || e.metaKey === true))
                ){
                  return;
                }

                if (tinyLength > (+this.settings.truncate.content + 1) ){
                  // Prevent insertion of typed character
                  //tinymax + 1 because is needed to show alert and force the user to delete a character
                  this.$root.$toast("You've reached the maximum number of characters (" + (+this.settings.truncate.content) +")",{
                    className: 'et-error',
                    horizontalPosition: 'right',
                  });
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }

              })
              .on('keyup change', (e) => {

                if( !( this.settings.lines_limit && this.settings.lines_limit.content) ){
                  //if truncate is NAN, returns and avoid validations
                  return
                }

                tinyLength = editor.getContent({format: 'text'}).trim().length;
                let $textElement = $('#'+tinyMCE.activeEditor.id);

                //Check for Lines Limit
                if( this.settings.lines_limit && (+this.settings.lines_limit.content > 0) ){

                  let divHeight = $textElement.height();
                  let lineHeight = parseInt($textElement.css("lineHeight"));
                  let actualLines = divHeight / lineHeight;

                  if (actualLines > +this.settings.lines_limit.content) {

                    this.$root.$toast("You've reached the maximum number of lines (" + (+this.settings.lines_limit.content) +")",{
                      className: 'et-error',
                      horizontalPosition: 'right',
                      duration: 2000,
                    });

                    $textElement
                      .addClass('bg-danger');

                    return false
                  } else {
                    $textElement
                      .removeClass('bg-danger');
                  }
                }

              });
          },
          paste_preprocess: (plugin, args) => {

            let editor = tinymce.get(tinymce.activeEditor.id);``

            if( !this.settings.truncate ){
              //if truncate is NAN, returns and avoid validations
              return
            }

            //trim string if exceed max char limit
            let tinyLength = editor.getContent({format: 'text'}).length - 1;
            let charsToPaste = +this.settings.truncate.content - tinyLength;
            args.content = args.content.trim().substring(0, charsToPaste);


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

<style lang="less">
  .stx-edit-text {
    cursor: text;
  }
</style>
