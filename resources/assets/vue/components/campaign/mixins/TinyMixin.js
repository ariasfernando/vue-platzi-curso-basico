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
    $textElement() {
      return $('#' + this.editorId);
    },
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
            const $parentEl = $el.parents().filter(function () {
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
        if (link_fixed_styles && link_fixed_styles["text-decoration"] === "underline") {
          const $el = $(el);
          $el.find('span').css('text-decoration', 'underline');

          if (!($el.contents()[0] && $el.contents()[0].nodeName && $el.contents()[0].nodeName == 'SPAN')) {
            let content = $el.html();
            content = $('<span style="text-decoration:underline;">').html(content);
            $el.html(content);
          }
        }
      });
    },
    tinyMaxLines() {
      const editor = tinymce.get(this.editorId);
      if (editor.settings.max_lines) {
        if (parseInt(editor.settings.max_lines)) {
          return parseInt(editor.settings.max_lines) || undefined;
        } else {
          const firstTextElement = this.$textElement.find('p')[0] || this.$textElement.find('li')[0];
          const fontSize = document.defaultView.getComputedStyle(firstTextElement).getPropertyValue('font-size');
          return JSON.parse(editor.settings.max_lines)[fontSize];
        }
      }
    },
    tinyMax() {
      const editor = tinymce.get(this.editorId);
      return parseInt(editor.settings.max_chars) || undefined;
    },
    tinyMin() {
      const editor = tinymce.get(this.editorId);
      return parseInt(editor.settings.min_chars) || undefined;
    },
    tinyLength() {
      return this.$textElement.text().length;
    },
    maxCharsValidation(event) {
      // Check for Characters Limit
      if (this.tinyLength() > this.tinyMax()) {
        this.setError({
          toastMessage: `You've exceeded the maximum number of characters (${this.tinyMax()})`,
        });

        // Prevent insertion of more characters
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        return false;
      } else {
        this.clearError();
      }
    },
    maxLinesValidation(event) {
      const divHeight = this.$textElement.height();
      const firstTextElement = this.$textElement.find('p')[0] || this.$textElement.find('li')[0];
      const lineHeight = parseInt(document.defaultView.getComputedStyle(firstTextElement).getPropertyValue('line-height'));
      const actualLines = parseInt(divHeight / lineHeight);

      if (actualLines > this.tinyMaxLines()) {
        this.setError({
          toastMessage: `You've exceeded the maximum number of lines (${this.tinyMaxLines()})`,
        });

        // Prevent insertion of more lines
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        return false;
      }
      this.clearError();
    },
    minCharsValidation(event) {
      if (this.tinyLength() < this.tinyMin()) {
        this.setError({
          toastMessage: `You've exceeded the minimum number of characters (${this.tinyMin()})`,
        });

        if (event) {
          let code = null;
          if (event.key !== undefined) {
            code = event.key;
          } else if (event.keyCode !== undefined) {
            code = event.keyCode;
          }
          if (code !== 'Backspace') {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      } else {
        this.clearError();
      }
    },
    setError(error) {
      const elementClass = error.elementClass || 'bg-danger';
      const toastClass = error.toastClass || 'et-error';
      const toastPosition = error.toastPosition || 'right';
      setTimeout(() => {
        this.$textElement.addClass(`${elementClass} tinymce-error`);
      }, 50);
      this.$root.$toast(error.toastMessage, {
        className: toastClass,
        horizontalPosition: toastPosition,
      });
    },
    clearError(errorClass) {
      const elementClass = errorClass || 'bg-danger';
      this.$textElement.removeClass(`${elementClass} tinymce-error`);
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
        plugins: 'paste advlist autolink lists stlinkextended textcolor sttextcolorextended  stformatsmenu',
        inline: true,
        menubar: false,
        link_title: false,
        link_text_to_display: false,
        link_fixed_color: false,
        link_fixed_color_enabled: this.textOptions.config.settings.link_fixed_color ? this.textOptions.config.settings.link_fixed_color.value : false,
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
        min_chars: this.textOptions.config.settings.min_chars ? this.textOptions.config.settings.min_chars.content : undefined,
        max_chars: this.textOptions.config.settings.truncate ? this.textOptions.config.settings.truncate.content : undefined,
        max_lines: this.textOptions.config.settings.lines_limit ? this.textOptions.config.settings.lines_limit.content : undefined,
        advlist_bullet_styles: 'default',
        advlist_number_styles: 'default',

        init_instance_callback: (editor) => {
          _this.setStyles();
        },
        setup(editor) {
          editor.paste_block_drop = true;
          editor.on('focus', (e) => {
              // Change icon tiny
              // TODO  implement DRY.
            const $toolbox = $(editor.settings.fixed_toolbar_container);

            if ($toolbox.length && !$toolbox.find('div[aria-label="Font Sizes"] .text-size').length) {
              setTimeout(() =>  {
                $toolbox.find('div[aria-label="Font Sizes"] button:first').empty();
                $toolbox.find('div[aria-label="Font Sizes"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
              });
            }
            if ($toolbox.length && !$toolbox.find('div[aria-label="Font Family"] .text-size').length) {
              setTimeout(() =>  {
                $toolbox.find('div[aria-label="Font Family"] button:first').empty();
                $toolbox.find('div[aria-label="Font Family"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
              });
            }
            if ($toolbox.length && !$toolbox.find('button:contains("Formats")').length ){
              setTimeout(() => {
                const $button = $toolbox.find("button:contains('Formats')");
                $button.parent('div').attr('aria-label', 'Font Format');
                $button.empty();
                $button.append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
              });
            }
            if ($toolbox.length && !$toolbox.find("div[aria-label='Format']").length) {
              setTimeout(() => {
                $toolbox.find('div[aria-label="Format"] button:first').empty();
                $toolbox.find('div[aria-label="Format"] button:first')
                  .append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-bold"></i>');
              });
            }
          });

          editor
          .on('keydown', (e) => {
            if (!(_this.tinyMax() || _this.tinyMaxLines() || _this.tinyMin())) {
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
              ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true))
            ) {
              if (code === 'Backspace') {
                // Check for Min Characters Limit
                _this.minCharsValidation(e);
              }
              return;
            }

            // Check for Characters Limit
            _this.maxCharsValidation(e);

            // Check for Lines Limit
            _this.maxLinesValidation(e);
          })
          .on('keyup change', (e) => {
            editor.bodyElement.dispatchEvent(new Event('tiny-change'));

            if (!(_this.tinyMax() || _this.tinyMaxLines() || _this.tinyMin())) {
              //if truncate is NAN, returns and avoid validations
              return;
            }

            // Check for Min Characters Limit
            _this.minCharsValidation(e);

            // Check for Characters Limit
            _this.maxCharsValidation(e);

            // Check for Lines Limit
            _this.maxLinesValidation(e);

          })
          .on('change', (e) => {
            _this.setStyles();
          })
          .on('ExecCommand', (e) => {
            if (e.command == 'mceInsertContent' && $(e.value)[0].nodeName == 'A')  {
              _this.setLinkStyles();
            }
          });
        },
        paste_preprocess: (plugin, args) => {
          const editor = tinymce.get(this.editorId);
          const tinyMax = this.tinyMax();

          if (!tinyMax) {
            // if truncate is NAN, returns and avoid validations
            return;
          }
          const ghostObj = $('<div/>').html(args.content);
          const cleanTxt = ghostObj.text();
          // trim string if exceed max char limit

          const tinyLength = $(editor.getContent({ format: 'html' })).text().length;
          const charsToPaste = tinyMax - tinyLength;

          if (cleanTxt.length > charsToPaste){
            args.content = cleanTxt.trim().substring(0, charsToPaste);
          } else {
            args.content = cleanTxt.trim();
          }
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

      // Extend plugins
      if ('extend_plugins' in this.textOptions.config.settings) {
        settings.plugins = [settings.plugins, this.textOptions.config.settings.extend_plugins.join(' ')].join(' ');
      }

      // Extend toolbar
      if ('extend_toolbar' in this.textOptions.config.settings) {
        settings.plugins = [settings.plugins, this.textOptions.config.settings.extend_toolbar.join(' ')].join(' ');
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