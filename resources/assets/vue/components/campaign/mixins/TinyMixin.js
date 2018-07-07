import _ from 'lodash';

export default {
  props: ['name', 'plugin'],
  mounted() {
    if (this.textOptions.enabled) {
      this.initTinyMCE();
    }
  },
  computed: {
    textOptions() {
      return this.component.plugins.textOptions;
    },
    tinyMaxLines() {
      const editor = tinymce.get(this.editorId);
      if (parseInt(editor.settings.max_lines)) {
        return parseInt(editor.settings.max_lines) || undefined;
      } else {
        const node = editor.selection.getNode();
        const fontSize = document.defaultView.getComputedStyle(node).getPropertyValue("font-size");
        return JSON.parse(editor.settings.max_lines)[fontSize];
      }
    },
    textElement() {
      return $('#' + this.editorId);
    }
  },
  methods: {
    setStyles() {
      const nameComponent = this.component.type;
      const libraryLinkColor = this.libraryConfig.linkColor;
      const editor = tinymce.get(this.editorId);
      const ul_fixed_style = editor.settings.ul_fixed_style;
      const ol_fixed_style = editor.settings.ol_fixed_style;
      const li_fixed_style = editor.settings.li_fixed_style;
      const p_fixed_style = editor.settings.p_fixed_style;
      const persist_styles = editor.settings.persist_styles;
      const button_inline_color = editor.settings.button_inline_color;

      if (nameComponent === 'button-element' && button_inline_color) {
        this.changeStyles('p', { color: this.component.button.style.color || libraryLinkColor });
      }
      if (ul_fixed_style) {
        this.changeStyles('ul', ul_fixed_style);
      }
      if (ol_fixed_style) {
        this.changeStyles('ol', ol_fixed_style);
      }
      if (li_fixed_style && Application.utils.isJsonString(li_fixed_style)) {
        this.changeStyles('li', JSON.parse(li_fixed_style));
      }
      if (p_fixed_style && Application.utils.isJsonString(p_fixed_style)) {
        this.changeStyles('p', JSON.parse(p_fixed_style));
      }
      if (persist_styles && Application.utils.isJsonString(persist_styles)) {
        const persist_stylesJson = JSON.parse(persist_styles);
        for (var i = 0; i < persist_stylesJson.length; i++) {
          const selector = Object.keys(persist_stylesJson[i])[0];
          const editorLinks = $(editor.targetElm).find(selector);
          if (editorLinks.length) {
            for (var i = 0; i < editorLinks.length; i++) {
              $(editorLinks[i]).attr('data-persist-styles', persist_stylesJson[i][selector]);
            }
          }
        }
      }

      this.setLinkStyles();
    },
    changeStyles(selector, styles) {
      const editor = tinymce.get(this.editorId);
      const editorLinks = $(editor.targetElm).find(selector);
      if (editorLinks.length) {
        for (let i = 0; i < editorLinks.length; i++) {
          if (typeof styles === 'string') {
            $(editorLinks[i]).css('cssText', styles);
          } else {
            $(editorLinks[i]).css(styles);
          }
        }
      }
    },
    setLinkStyles() {

      const editor = tinymce.get(this.editorId);
      const link_fixed_color = editor.settings.link_fixed_color;
      const link_fixed_styles = editor.settings.link_fixed_styles;
      const editorLinks = $(editor.targetElm).find('a');

      /* 
      * Color Treatment
      */

      // check if link_fixed_color is setup an apply it, otherwise, apply parent color
      if (link_fixed_color && /^#[0-9A-F]{6}$/i.test(link_fixed_color)) {
        this.changeStyles('a', { color: link_fixed_color });
      } else {
        if (editorLinks.length) {
          for (let i = 0; i < editorLinks.length; i++) {
            const $el = $(editorLinks[i]);
            // return the first parent that has a color
            const $parentEl = $el.parents().filter(function (){
              return $(this).css('color');
            });
            // get the color of the parent and apply it to the link 
            const parentColor = $parentEl.css('color');
            $el.css('color', parentColor);
          }
        }
      }

      /*
      * Fixed Styles Treatment
      */

      if (link_fixed_styles) {
        this.changeStyles('a', link_fixed_styles);
      }

      /* 
      * Underline Treatment 
      * note: text-decoration:underline in <a> is overriden by css clases in email clients, 
      * so we have to add an underlined span inside
      */

      $.each(editorLinks, (index, el) => {
        if (link_fixed_styles["text-decoration"] == "underline") {
          const $el = $(el);
          $el.find('span').css("text-decoration","underline");

          if(!($el.contents()[0] && $el.contents()[0].nodeName && $el.contents()[0].nodeName == "SPAN")){
            let content = $el.html();
            content = $('<span style="text-decoration:underline;">').html(content);
            $el.html(content);
          }
        }
      });
    },
    tinyMax() {
      const editor = tinymce.get(this.editorId);
      return parseInt(editor.settings.max_chars) || undefined;
    },
    tinyLength() {
      return this.textElement.text().length;
    },
    maxCharsValidation(event) {
      const $textElement = this.textElement;

      // Check for Characters Limit
      if ((this.tinyLength() + 1) > this.tinyMax()) {
        // Prevent insertion of typed character
        
        setTimeout(() => {
          $textElement.addClass('bg-danger tinymce-error');
        }, 50);
        
        this.$root.$toast(`PEPE You've reached the maximum number of characters (${this.tinyMax()})`, {
          className: 'et-error',
          horizontalPosition: 'right',
        });
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        return false;
      } else {
        $textElement.removeClass('bg-danger tinymce-error');
      }
    },
    maxLinesValidation(event) {
      const $textElement = this.textElement;
      const divHeight = $textElement.height();
      const lineHeight = parseInt($textElement.css("lineHeight"));
      const actualLines = parseInt(divHeight / lineHeight);

      if (actualLines > this.tinyMaxLines) {
        this.$root.$toast("You've reached the maximum number of lines (" + (this.tinyMaxLines) +")",{
          className: 'et-error',
          horizontalPosition: 'right',
          duration: 2000,
        });

        $textElement.addClass('bg-danger tinymce-error');

        if(event){
          event.preventDefault();
          event.stopPropagation();
        }

        return false
      }else{
        $textElement.removeClass('bg-danger tinymce-error');
      }
    },
    minCharsValidation() {

    },
    validateTiny() {
      this.maxCharsValidation();
      this.maxLinesValidation();
      this.minCharsValidation();
    },
    initTinyMCE() {
      const _this = this;
      const options = _.filter(this.textOptions.config.options, 'value');
      const customSettings = {};

      _.each(this.textOptions.config.settings, (e, k) => {
        if (Application.utils.isJsonString(e.content)) {
          customSettings[k] = JSON.parse(e.content);
        } else {
          customSettings[k] = e.content || e.value;
        }
      });

      let toolbar = [];

      if (!_.isEmpty(options)) {
        _.each(options, (option) => {
          toolbar.push(option.key);
        });
        toolbar = toolbar.join(' ');
      } else {
        toolbar = ' ';
      }
      const editorId = ['editor', this.module.idInstance, this.columnId, this.componentId].join('-');
      
      // Destroy previous instance
      const previousInstance = tinymce.get(editorId);
      if (previousInstance) {
        previousInstance.destroy();
      }


      const settings = {

        selector: `#${editorId}`,
        fixed_toolbar_container: `.toolbar-${editorId}`,
        document_base_url: `${Application.globals.cdnHost  }/js/tinymce/`,
        skin: 'lightgray',
        skin_url: `${Application.globals.cdnHost  }/css/tinymce/lightgray`,
        toolbar,
        plugins: 'paste advlist autolink lists stlinkextended textcolor sttextcolorextended',
        inline: true,
        menubar: false,
        link_title: false,
        link_text_to_display: false,
        link_fixed_color: false,
        link_fixed_color_enabled: this.textOptions.config.settings.link_fixed_color.value,
        link_fixed_styles: false, // '{"text-decoration": "underline"}',
        button_inline_color: true,
        // persist_styles: JSON.stringify([{"ul":'{"mso-list": "disc"}'}]),
        ul_fixed_style: 'margin-bottom: 0px !important; margin-top: 0px !important; margin-left: 25px; padding-left: 0px;',
        ol_fixed_style: 'margin-bottom: 0px !important; margin-top: 0px !important; margin-left: 25px; padding-left: 0px;',
        li_fixed_style: '{"margin":0}',
        p_fixed_style: '{"margin":0}',
        forced_root_block: 'p',
        target_list: false,
        invalid_elements: 'img',
        link_validate_url: true,
        data_description: true,
        paste_as_text: true,
        relative_urls: false,
        max_chars: this.textOptions.config.settings.truncate ? this.textOptions.config.settings.truncate.content : undefined,
        max_lines: this.textOptions.config.settings.lines_limit ? this.textOptions.config.settings.lines_limit.content : undefined,
        advlist_bullet_styles: 'default',
        advlist_number_styles: 'default',

        init_instance_callback: (editor) => {
          _this.setStyles();
        },
        setup(editor) {
          editor.on('focus', (e) => {
              // Change icon tiny
              // TODO  implement DRY.
            const $toolbox = $(editor.settings.fixed_toolbar_container);

            if ($toolbox.length && !$toolbox.find("div[aria-label='Font Sizes'] .text-size").length) {
                setTimeout(() =>  {
                    $toolbox.find('div[aria-label="Font Sizes"] button:first').empty();
                    $toolbox.find('div[aria-label="Font Sizes"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
                  }, 100);
              }
              if ($toolbox.length && !$toolbox.find("div[aria-label='Font Family'] .text-size").length) {
                setTimeout(() =>  {
                    $toolbox.find('div[aria-label="Font Family"] button:first').empty();
                    $toolbox.find('div[aria-label="Font Family"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
                  }, 100);
              }
              if ($toolbox.length && !$toolbox.find("button:contains('Formats')").length ){
                  setTimeout(function(){
                      var $button = $toolbox.find("button:contains('Formats')");
                      $button.parent('div').attr('aria-label','Font Format');
                      $button.empty();
                      $button.append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
                  }, 100);
              };
          });

          editor
            .on('keydown', (e) => {
              if (!(_this.tinyMax() || _this.tinyMaxLines)) {
                // if truncate is NAN, returns and avoid validations
                return;
              }
              const allowKeys = [
                //  key      keyCode
                'Backspace', 8,
                'Delete', 46,
                'Tab', 9,
                'Escape', 27,
                'Home', 36,
                'End', 35,
                'ArrowLeft', 37,
                'ArrowRight', 39,
                'ArrowUp', 38,
                'ArrowDown', 40,
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
              ) {
                return;
              }

              //Check for Characters Limit
              _this.maxCharsValidation(e);

              // Check for Lines Limit
              _this.maxLinesValidation(e);
            })
            .on('keyup change', (e) => {
              editor.bodyElement.dispatchEvent(new Event("tiny-change"));

              if( !(_this.tinyMax() || _this.tinyMaxLines) ){
                //if truncate is NAN, returns and avoid validations
                return
              }

              //Check for Characters Limit
              _this.maxCharsValidation(e);

              //Check for Lines Limit
              _this.maxLinesValidation(e);

            })
            .on('change', (e) => {
              _this.setStyles();
            })
            .on('ExecCommand', (e) => {
              if(e.command == "mceInsertContent" && $(e.value)[0].nodeName == "A")  {
                _this.setLinkStyles();
              }
            });
        },
        paste_preprocess: (plugin, args) => {
          const editor = tinymce.get(tinymce.activeEditor.id);
          const tinyMax = parseInt(editor.settings.max_chars);
          
          if (!tinyMax) {
            // if truncate is NAN, returns and avoid validations
            return;
          }

          // trim string if exceed max char limit
          const tinyLength = editor.getContent({ format: 'text' }).length - 1;            
          const charsToPaste = tinyMax - tinyLength;
          args.content = args.content.trim().substring(0, charsToPaste);
        },

      };

      if (!_.isEmpty(options)) {
        _.each(options, (option) => {
          if (option.key === 'forecolor' && !_.isEmpty(option.textcolor_map) && !option.textcolor_from_library) {
            settings.plugins = [settings.plugins, 'textcolor'].join(' ');
            settings.textcolor_map = option.textcolor_map;
          } else if (option.textcolor_from_library && Application.utils.isJsonString(this.libraryConfig.colorPalettes)) {
            settings.textcolor_map = JSON.parse(this.libraryConfig.colorPalettes)[option.palette_name];
          }
        });
      }

      _.extend(settings, customSettings);

      tinymce.init(settings);
      this.validateTiny();
    },
    destroyed() {
      tinymce.get(editorId).destroy();
    },
  },
};
