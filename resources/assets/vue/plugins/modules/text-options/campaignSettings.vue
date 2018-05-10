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
    $timer: null,
    methods: {
      // sets the cursor position to the defined node
      // ed: editor, start: defines if the cursor is to be placed at the start or end of the node
      // return node: boolean, if set returns the caretnode instead of deleting it
      setCursor(ed, node, start){

        const tn = ed.getDoc().createTextNode(".");
        if (start){
          node.insertBefore(tn, node.firstChild);
        }
        else node.appendChild(tn);

        const rng = ed.selection.getRng();
        rng.selectNode(tn);
        rng.setStartBefore(tn);
        rng.setStartAfter(tn);

        ed.selection.setRng(rng);

        node.removeChild(tn);
      },
      initTinyMCE() {
        const _this = this;
        const options = _.filter(this.plugin.config.options, 'value');
        const customSettings = {};

        _.each(this.plugin.config.settings, (e, k) => {

          let content;
          if (Application.utils.isJsonString(e.content)){
            customSettings[k] = JSON.parse(e.content);
          } else {
            customSettings[k] = e.content || e.value;
          };
        });

        let toolbar = [];

        if (!_.isEmpty(options)) {
          _.each(options, (option) => {
            toolbar.push(option.key)
          });
          toolbar = toolbar.join(' ');
        } else {
          toolbar = ' ';
        }

        const idInstance = this.$store.getters["campaign/modules"][this.currentComponent.moduleId].idInstance
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;
        const editorId = ['editor', idInstance, moduleId, columnId, componentId].join('-');

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
          link_title: false,
          link_text_to_display: false,
          link_fixed_color: false,
          link_fixed_styles: false,//'{"text-decoration": "underline"}',
          // persist_styles: JSON.stringify([{"ul":'{"mso-list": "disc"}'}]),
          ul_fixed_style: 'margin-bottom: 0px !important; margin-top: 0px !important; margin-left: 25px; padding-left: 0px;',
          ol_fixed_style: 'margin-bottom: 0px !important; margin-top: 0px !important; margin-left: 25px; padding-left: 0px;',
          li_fixed_style: '{"margin":0}',
          p_fixed_style: '{"margin":0}',
          forced_root_block :false,
          target_list: false,
          invalid_elements:'img',
          link_validate_url: true,
          data_description:true,
          paste_as_text:true,
          relative_urls: false,
          max_chars: this.plugin.config.settings.truncate ? this.plugin.config.settings.truncate.content : undefined,
          max_lines: this.plugin.config.settings.lines_limit ? this.plugin.config.settings.lines_limit.content : undefined,
          advlist_bullet_styles: 'default',
          advlist_number_styles: 'default',

          init_instance_callback: (editor) => {
            editor.on('blur', (e) => {
              if (this.$timer) {
                clearTimeout(this.$timer);
              }

              this.$store.commit('campaign/updateElement', {
                moduleId: moduleId,
                columnId: columnId,
                componentId: componentId,
                data: {
                  text: editor.getContent()
                }
              });

              tinymce.get(editorId).destroy();
            }),

            editor.on('keyup', (e) => {
              if (this.$timer) {
                clearTimeout(this.$timer);
              }

              this.$timer = setTimeout(() => {
                const bm = editor.selection.getBookmark(2, true);

                this.$store.commit('campaign/updateElement', {
                  moduleId: moduleId,
                  columnId: columnId,
                  componentId: componentId,
                  data: {
                    text: editor.getContent()
                  }
                });

                // Hack to restore cursor at the time of saving
                setTimeout(() => {
                  if (editor) {
                    editor.selection.moveToBookmark(bm);
                  }
                }, 10);
              }, 500);
            });
          },

          setup (editor) {
            editor.on('focus', (e) => {
                
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

            //Check for Chars Limit

            let tinyMax = parseInt(editor.settings.max_chars);
            let tinyMaxLines = parseInt(editor.settings.max_lines);
            let tinyLength, tinyText;

            editor
              .on('keydown',(e) => {

                if(!tinyMax){
                  //if truncate is NAN, returns and avoid validations
                  return
                }

                let $textElement = $('#'+tinyMCE.activeEditor.id);
                tinyLength = $textElement.text().length;
                        
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

                //Check for Characters Limit
                if ((tinyLength + 1) > tinyMax) {
                  // Prevent insertion of typed character
                  _this.$root.$toast("You've reached the maximum number of characters (" + (tinyMax) +")",{
                    className: 'et-error',
                    horizontalPosition: 'right',
                  });
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }

              })
              .on('keyup change', (e) => {
                if( !(tinyMax || tinyMaxLines) ){
                  //if truncate is NAN, returns and avoid validations
                  return
                }

                let $textElement = $('#'+tinyMCE.activeEditor.id);
                tinyLength = $textElement.text().length;

                //Check for Characters Limit
                if ((tinyLength + 1) > tinyMax) {
                  // Prevent insertion of typed character
                  _this.$root.$toast("You've reached the maximum number of characters (" + (tinyMax) +")",{
                    className: 'et-error',
                    horizontalPosition: 'right',
                  });
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }

                //Check for Lines Limit

                let divHeight = $textElement.height();
                let lineHeight = parseInt($textElement.css("lineHeight"));
                let actualLines = divHeight / lineHeight;

                if (actualLines > tinyMaxLines) {

                  _this.$root.$toast("You've reached the maximum number of lines (" + (tinyMaxLines) +")",{
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

              })
              .on('change', (e) => {
                const editor = tinymce.get(tinymce.activeEditor.id);
                const link_fixed_color = editor.settings.link_fixed_color;
                const link_fixed_styles = editor.settings.link_fixed_styles;
                const ul_fixed_style = editor.settings.ul_fixed_style;
                const ol_fixed_style = editor.settings.ol_fixed_style;
                const li_fixed_style = editor.settings.li_fixed_style;
                const p_fixed_style = editor.settings.p_fixed_style;
                const persist_styles = editor.settings.persist_styles;

                const changeStyles = (selector, styles) => {
                  let editorLinks = $(editor.targetElm).find(selector);
                  if(editorLinks.length){
                    for (var i = 0; i < editorLinks.length; i++) {
                      if(typeof styles === "string"){
                        $(editorLinks[i]).css('cssText', styles);
                      } else {
                        $(editorLinks[i]).css(styles);
                      }
                    }
                  }
                }
                if( link_fixed_color && /^#[0-9A-F]{6}$/i.test(link_fixed_color) ){
                  changeStyles('a',{'color':link_fixed_color});
                }
                if( link_fixed_styles  && Application.utils.isJsonString(link_fixed_styles)){
                  changeStyles('a', JSON.parse(link_fixed_styles));
                }
                if( ul_fixed_style){
                    changeStyles('ul', ul_fixed_style);
                }
                if( ol_fixed_style){
                    changeStyles('ol', ol_fixed_style);
                }
                if( li_fixed_style && Application.utils.isJsonString(li_fixed_style)){
                    changeStyles('li', JSON.parse(li_fixed_style));
                }
                if( p_fixed_style && Application.utils.isJsonString(p_fixed_style)){
                  changeStyles('p', JSON.parse(p_fixed_style));
                }
                if( persist_styles && Application.utils.isJsonString(persist_styles)){
                  let persist_stylesJson = JSON.parse(persist_styles)
                    for (var i = 0; i < persist_stylesJson.length; i++) {
                      let selector = Object.keys(persist_stylesJson[i])[0]
                      const editorLinks = $(editor.targetElm).find(selector);
                        if(editorLinks.length){
                        for (var i = 0; i < editorLinks.length; i++) {
                          $(editorLinks[i]).attr('data-persist-styles', persist_stylesJson[i][selector]);
                        }
                      }
                    }
                  }
              });
          },
          paste_preprocess: function (plugin, args) {
            
            let editor = tinymce.get(tinymce.activeEditor.id);
            let tinyMax = parseInt(editor.settings.max_chars);
            
            if(!tinyMax){
              //if truncate is NAN, returns and avoid validations
              return
            }

            //trim string if exceed max char limit
            let tinyLength = editor.getContent({format: 'text'}).length - 1;            
            let charsToPaste = tinyMax - tinyLength;
            args.content = args.content.trim().substring(0, charsToPaste);


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

        _.extend(settings, customSettings);

        tinymce.init(settings);
      },
      destroyed () {
        tinymce.get(editorId).destroy();
      }
    }
  }
</script>
<style lang="less">
  // hidde the sub menu of Numbered list and Bullet list
  div[aria-label="Numbered list"],
  div[aria-label="Bullet list"]{
    button.mce-open{
      display: none; 
    }
  }
</style>