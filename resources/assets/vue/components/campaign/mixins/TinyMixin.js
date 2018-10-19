import _ from 'lodash';
import Adapter from './tinyMce/Adapter';

export default {
  props: ['name', 'plugin'],
  mixins: [
    Adapter,
  ],
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
      const p_fixed_style = editor.settings.p_fixed_style;
      const persist_styles = editor.settings.persist_styles;
      const button_inline_color = editor.settings.button_inline_color;

      if (nameComponent === 'button-element' && button_inline_color) {
        this.changeStyles('p', {
          color: this.component.button.style.color || libraryLinkColor
        });
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

      this.setListStyles();
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
        if (editorLinks.length) {
          for (let i = 0; i < editorLinks.length; i++) {
            const $el = $(editorLinks[i]);

            // check if element has a span as parent and then check colors
            const $span = $el.parent('span');
            if ($span.length) {
              // return the first span parent that has a color
              const $parentEl = $span.parents().filter(function () {
                return $(this).css('color');
              });
              const parentColor = $parentEl.css('color');
              const spanColor = $span.css('color');
              // if span and parent color are the same, we assume that the span is inheriting the color
              // so we apply the fixed color, otherwise, we let the span color.
              const newColor = parentColor === spanColor ? link_fixed_color : spanColor;
              $el.css('color', newColor);
            } else {
              $el.css('color', link_fixed_color);
            }
          }
        }
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
    setListStyles() {
      const editor = tinymce.get(this.editorId);
      const ul_fixed_style = editor.settings.ul_fixed_style;
      const ol_fixed_style = editor.settings.ol_fixed_style;
      const li_fixed_style = editor.settings.li_fixed_style;
      const li_keep_children_style = editor.settings.li_keep_children_style;

      if (ul_fixed_style) {
        this.changeStyles('ul', ul_fixed_style);
      }
      if (ol_fixed_style) {
        this.changeStyles('ol', ol_fixed_style);
      }
      if (li_fixed_style && Application.utils.isJsonString(li_fixed_style)) {
        this.changeStyles('li', JSON.parse(li_fixed_style));
      }

      if (li_keep_children_style) {
        const editorLists = $(editor.targetElm).find('li');
        editorLists.each((index, el) => {
          const firstTextElement = $(el).find('span')[0];
          if (firstTextElement) {
            const computedStyle = document.defaultView.getComputedStyle(firstTextElement)
            const fontSize = computedStyle.getPropertyValue('font-size');
            const lineHeight = computedStyle.getPropertyValue('line-height');
            const letterSpacing = computedStyle.getPropertyValue('letter-spacing');
            $(el).css({
              fontSize,
              lineHeight,
              letterSpacing,
            });
          }
        });
      }
    },
    tinyMaxLines() {
      const editor = tinymce.get(this.editorId);
      if (editor.settings.max_lines) {
        if (parseInt(editor.settings.max_lines)) {
          return parseInt(editor.settings.max_lines) || undefined;
        } else {
          const firstTextElement = this.$textElement[0].firstElementChild;
          let firstTextNode = firstTextElement.firstChild;
          // if the first node is a text node, we go up to te parent element.
          if (firstTextNode.nodeName === '#text') {
            firstTextNode = firstTextElement;
          }
          const fontSize = document.defaultView.getComputedStyle(firstTextNode).getPropertyValue('font-size');
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
      }
      this.clearError();
    },
    maxLinesValidation(event) {
      const divHeight = this.$textElement.height();
      const firstTextElement = this.$textElement[0].firstElementChild;
      let firstTextNode = firstTextElement.firstChild;

      // if the first node is a text node, we go up to te parent element.
      if (firstTextNode.nodeName === '#text') {
        firstTextNode = firstTextElement;
      }

      const lineHeight = parseInt(document.defaultView.getComputedStyle(firstTextNode).getPropertyValue('line-height'));
      const actualLines = divHeight / lineHeight;

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
    styleFormatsIncrement() {
      const style_formats = [];

      const loop = this.textOptions.config.settings.style_formats_increment.content;

      let step = Number(loop.steps.range.split(':')[0]);
      let currentFontSize = Number(loop.styles.fontSize.initial) || step;
      const rangeMax = Number(loop.steps.range.split(':')[1]);

      const runBehaviour = (behaviour, initialValue) => {
        behaviour = behaviour.split(':');
        const behaviourType = behaviour[0];
        const behaviourFactor = Number(behaviour[1]);

        let result = Number(initialValue);

        switch (behaviourType) {
          case 'static':
            // leave result as is
            break;
          case 'fixed':
            result = behaviourFactor;
            break;
          case 'add':
            result += behaviourFactor;
            break;
          case 'multiply':
            result = Math.round(result * behaviourFactor);
            break;
          default:
            console.log('Error: behaviour type not defined');
        }
        return result;
      }

      const getTitle = (tmp, val, unit) => {
        let template = tmp || '%fontVal%unit';
        if (template.indexOf('%fontVal') !== -1) {
          template = template.replace('%fontVal', val);
          if (unit) template = template.replace('%unit', unit);
          return template;
        }
        return template.replace('%stepVal', step);
      };

      while (step <= rangeMax) {
        const format = {
          styles: {},
        };

        _.forOwn(loop.styles, (prop, key) => {
          const keyBehaviour = prop.behaviour || loop.steps.behaviour;
          const unit = prop.unit || 'px';
          const result = runBehaviour(keyBehaviour, currentFontSize);
          format.styles[key] = `${result}${unit}`;
        });

        _.forOwn(loop.settings, (prop, key) => {
          format[key] = prop;
        });

        const fontSizeBehaviour = loop.styles.fontSize.behaviour || loop.steps.behaviour;
        const fontSizeUnit = loop.styles.fontSize.unit || 'px';
        format.title = getTitle(loop.title, currentFontSize, fontSizeUnit);
        format.styles.fontSize = `${currentFontSize}${fontSizeUnit}`;
        style_formats.push(format);

        currentFontSize = runBehaviour(fontSizeBehaviour, currentFontSize);
        step = runBehaviour(loop.steps.behaviour, step);
      }
      return style_formats;
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

      if (this.textOptions.config.settings.style_formats_increment && this.textOptions.config.settings.style_formats_increment.value) {
        customSettings.style_formats = this.styleFormatsIncrement();
      }

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
              setTimeout(() => {
                $toolbox.find('div[aria-label="Font Sizes"] button:first').empty();
                $toolbox.find('div[aria-label="Font Sizes"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
              });
            }
            if ($toolbox.length && !$toolbox.find('div[aria-label="Font Family"] .text-size').length) {
              setTimeout(() => {
                $toolbox.find('div[aria-label="Font Family"] button:first').empty();
                $toolbox.find('div[aria-label="Font Family"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
              });
            }
            if ($toolbox.length && !$toolbox.find('button:contains("Formats")').length) {
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
            // set toolbar width
            if ($toolbox.length) {
              setTimeout(() => {
                const toolboxWidth = $toolbox.find('.mce-btn-group').width();
                $toolbox.find('.mce-container-body').width(toolboxWidth);
                $toolbox.find('.mce-panel').width(toolboxWidth);
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
              if (e.command === 'mceInsertContent' && $(e.value)[0].nodeName === 'A') {
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
          const tinyLength = editor.getContent({
            format: 'text',
          }).length - 1;
          const charsToPaste = tinyMax - tinyLength;
          args.content = args.content.trim().substring(0, charsToPaste);
        },

      };

      if (!_.isEmpty(options)) {
        _.each(options, (option) => {
          if (option.key === 'forecolor' && !_.isEmpty(option.textcolor_map) && !option.textcolor_from_library) {
            settings.textcolor_map = this.adapter(option.textcolor_map, 'forecolor');
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
        settings.toolbar = [settings.toolbar, this.textOptions.config.settings.extend_toolbar.join(' ')].join(' ');
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
