/* eslint camelcase:0 */
import Adapter from './tinymce/Adapter';
import listStylesFix from './tinymce/listStyles.fix';
import utils from './tinymce/utils';

export default {
  props: ['editor-id', 'textDirty', 'type', 'config', 'fontStyles', 'text', 'tinyClass', 'sync'],
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
      return this.config;
    },
    $textElement() {
      return $(`#${this.editorId}`);
    },
    libraryConfig() {
      return this.$store.state.campaign.campaign.library_config;
    },
  },
  methods: {
    setStyles() {
      const libraryLinkColor = this.libraryConfig ? this.libraryConfig.linkColor : undefined;
      const editor = tinymce.get(this.editorId);
      const p_fixed_style = editor.settings.p_fixed_style;
      const persist_styles = editor.settings.persist_styles;
      const button_inline_color = editor.settings.button_inline_color;

      if (this.type === 'button-element' && button_inline_color) {
        this.changeStyles('p', {
          color: this.fontStyles.color || libraryLinkColor,
        });
      }
      if (p_fixed_style && Application.utils.isJsonString(p_fixed_style)) {
        this.changeStyles('p', JSON.parse(p_fixed_style));
      }
      if (persist_styles && Application.utils.isJsonString(persist_styles)) {
        const persist_stylesJson = JSON.parse(persist_styles);
        for (let i = 0; i < persist_stylesJson.length; i++) {
          const selector = Object.keys(persist_stylesJson[i])[0];
          const editorLinks = $(editor.targetElm).find(selector);
          if (editorLinks.length) {
            for (let j = 0; j < editorLinks.length; j++) {
              $(editorLinks[j]).attr('data-persist-styles', persist_stylesJson[j][selector]);
            }
          }
        }
      }

      this.setListStyles();
      this.setLinkStyles();
    },
    changeStyles(tags, style, target) {
      const editor = tinymce.get(this.editorId);
      const targetElm = target || editor.targetElm;
      const elements = targetElm.querySelectorAll(tags) || [];
      if (elements.length) {
        elements.forEach((el) => {
          utils.setCssStyle(el, style);
        });
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
      } else if (editorLinks.length) {
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
        if (link_fixed_styles && link_fixed_styles['text-decoration'] === 'underline') {
          const $el = $(el);
          $el.find('span').css('text-decoration', 'underline');

          if (!($el.contents()[0] && $el.contents()[0].nodeName && $el.contents()[0].nodeName === 'SPAN')) {
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

      if (ul_fixed_style) {
        this.changeStyles('ul', ul_fixed_style);
      }
      if (ol_fixed_style) {
        this.changeStyles('ol', ol_fixed_style);
      }
      if (li_fixed_style && Application.utils.isJsonString(li_fixed_style)) {
        this.changeStyles('li', JSON.parse(li_fixed_style));
      }
      const li_keep_children_style = editor.settings.li_keep_children_style;

      if (li_keep_children_style) {
        const editorLists = $(editor.targetElm).find('li');
        editorLists.each((index, el) => {
          const firstTextElement = $(el).find('span')[0];
          if (firstTextElement) {
            const computedStyle = document.defaultView.getComputedStyle(firstTextElement);
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

      const lists = editor.targetElm.querySelectorAll('ul, ol') || [];
      lists.forEach((list) => {
        const firstLi = list.firstElementChild;
        this.setListAlignment(firstLi);
      });
    },
    setListAlignment(listItem, alignment) {
      const editor = tinymce.get(this.editorId);
      const directionality = _.get(this.textOptions, 'config.settings.direction.content', 'ltr');
      const list = listItem.parentElement;
      const listItems = list.querySelectorAll('li');
      const listItemStyle = {
        textAlign: listItem.style.textAlign,
      };


      /**
       * set listItem (LI) align and style-position
       */
      if (alignment) {
        switch (alignment) {
          case 'Justify':
            listItemStyle.textAlign = 'justify';
            break;
          case 'JustifyCenter':
            listItemStyle.textAlign = 'center';
            break;
          case 'JustifyRight':
            listItemStyle.textAlign = 'right';
            break;
          default:
            listItemStyle.textAlign = 'left';
            break;
        }
      }

      if (
        (directionality === 'ltr' && listItemStyle.textAlign !== '' && 'center right'.includes(listItemStyle.textAlign)) ||
        (directionality === 'rtl' && listItemStyle.textAlign !== '' && 'center left'.includes(listItemStyle.textAlign))
      ) {
        listItemStyle.listStylePosition = 'inside';
        listItemStyle.marginLeft = '0px';
        listItemStyle.marginRight = '0px';
      } else {
        listItemStyle.listStylePosition = '';
      }
      /**
       * if listStylePosition is defined, change set all Paragraphs to display inline.
       * else, restore default = ''
       */
      listItems.forEach((item) => {
        if (listItemStyle.listStylePosition) {
          item.querySelectorAll('p').forEach(p =>
            utils.setCssStyle(p, { display: 'inline' }),
          );
        } else {
          item.querySelectorAll('p').forEach(p =>
            utils.setCssStyle(p, { display: '', textAlign: '' }),
          );
        }
        utils.setCssStyle(item, listItemStyle);
      });

      /**
       * Set List Style (UL, OL)
       * if listStylePosition is defined, set margins to 0
       * else, restore fixedStyles
       */
      const listStyle = {};
      if (listItemStyle.listStylePosition) {
        listStyle.marginLeft = 0;
        listStyle.marginRight = 0;
      } else {
        const listFixedStyles = {
          ul: _.mapKeys(utils.getCssObj(editor.settings.ul_fixed_style), (v, k) => _.camelCase(k)),
          ol: _.mapKeys(utils.getCssObj(editor.settings.ol_fixed_style), (v, k) => _.camelCase(k)),
        };

        listStyle.marginLeft = list.nodeName === 'UL' ? listFixedStyles.ul.marginLeft : listFixedStyles.ol.marginLeft;
        listStyle.marginRight = list.nodeName === 'UL' ? listFixedStyles.ul.marginRight : listFixedStyles.ol.marginRight;
        listStyle.listStylePosition = '';
      }

      utils.setCssStyle(list, listStyle);
    },
    tinyMaxLines() {
      const editor = tinymce.get(this.editorId);
      if (editor.settings.max_lines) {
        if (_.isObject(editor.settings.max_lines)) {
          const firstTextElement = this.$textElement[0].firstElementChild;
          let firstTextNode = firstTextElement.firstChild;
          // if the first node is a text node, we go up to te parent element.
          if (firstTextNode.nodeName === '#text') {
            firstTextNode = firstTextElement;
          }
          const fontSize = document.defaultView.getComputedStyle(firstTextNode).getPropertyValue('font-size');
          return editor.settings.max_lines[fontSize];
        }
        // if is not an object, should be a number
        return parseInt(editor.settings.max_lines, 10) || undefined;
      }
      return undefined;
    },
    tinyMax() {
      const editor = tinymce.get(this.editorId);
      return parseInt(editor.settings.max_chars, 10) || undefined;
    },
    tinyMin() {
      const editor = tinymce.get(this.editorId);
      return parseInt(editor.settings.min_chars, 10) || undefined;
    },
    tinyLength() {
      // Remove "zero width no-break space" character
      return this.$textElement.text().replace(/\uFEFF/g, '').length;
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
      return true;
    },
    maxLinesValidation(event) {
      const divHeight = this.$textElement.height();
      const firstTextElement = this.$textElement[0].firstElementChild;
      let firstTextNode = firstTextElement.firstChild;

      // if the first node is a text node, we go up to te parent element.
      if (firstTextNode) {
        if (firstTextNode.nodeName === '#text') {
          firstTextNode = firstTextElement;
        }

        let lineHeight = 0;

        if (firstTextNode.nodeName === 'SUP') {
        // if the first node is a superscript, we should check with the line-height of the container
          lineHeight = parseInt(this.$textElement.css('line-height').replace('px', ''), 10);
        } else {
        // otherwise, check with the line-height of the first text
          lineHeight = parseInt(document.defaultView.getComputedStyle(firstTextNode).getPropertyValue('line-height'), 10);
        }

        // note: to perform the correct calculation, actualLines must be an integer
        const actualLines = Math.floor(divHeight / lineHeight);

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
      }
      return true;
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
        const splitBehaviour = behaviour.split(':');
        const behaviourType = splitBehaviour[0];
        const behaviourFactor = Number(splitBehaviour[1]);

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
      };

      const getTitle = (tmp, val, unit) => {
        let template = tmp || '%fontVal%unit';
        if (template.indexOf('%fontVal') !== -1) {
          template = template.replace('%fontVal', val);
          if (unit) template = template.replace('%unit', unit);
          return template;
        }
        return template.replace('%stepVal', step);
      };

      let format = {
        styles: {},
      };

      const func = (prop, key) => {
        const keyBehaviour = prop.behaviour || loop.steps.behaviour;
        const unit = prop.unit || 'px';
        const result = runBehaviour(keyBehaviour, currentFontSize);
        format.styles[key] = `${result}${unit}`;
      };

      const func2 = (prop, key) => {
        format[key] = prop;
      };

      while (step <= rangeMax) {
        format = {
          styles: {},
        };

        _.forOwn(loop.styles, func);

        _.forOwn(loop.settings, func2);

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
          customSettings[k] = this.adapter(JSON.parse(e.content), k);
        } else {
          customSettings[k] = e.content ? this.adapter(e.content, k) : this.adapter(e.value, k);
        }
      });

      if (this.textOptions.config.settings.style_formats_increment && this.textOptions.config.settings.style_formats_increment.value) {
        customSettings.style_formats = this.styleFormatsIncrement();
      }

      let toolbar = [];

      if (this.textOptions.config.toolbarString !== undefined) {
        toolbar = this.textOptions.config.toolbarString;
      } else if (!_.isEmpty(options)) {
        _.each(options, (option) => {
          toolbar.push(option.key);
        });
        toolbar = toolbar.join(' ');
      } else {
        toolbar = ' ';
      }
      // Destroy previous instance
      const previousInstance = tinymce.get(this.editorId);
      if (previousInstance) {
        previousInstance.destroy();
      }

      const settings = {
        selector: `#${this.editorId}`,
        fixed_toolbar_container: `.toolbar-${this.editorId}`,
        document_base_url: `${Application.globals.cdnHost}/js/tinymce/`,
        convert_urls: false,
        skin: 'lightgray',
        skin_url: `${Application.globals.cdnHost}/css/tinymce/lightgray`,
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
        data_description: Application.globals.maskLinks || false,
        paste_as_text: true,
        relative_urls: false,
        min_chars: this.textOptions.config.settings.min_chars ? this.textOptions.config.settings.min_chars.content : undefined,
        max_chars: this.textOptions.config.settings.truncate ? this.textOptions.config.settings.truncate.content : undefined,
        max_lines: this.textOptions.config.settings.lines_limit ? this.textOptions.config.settings.lines_limit.content : undefined,
        advlist_bullet_styles: 'default',
        advlist_number_styles: 'default',

        init_instance_callback: () => {
          _this.setStyles();
        },
        setup(editor) {
          editor.paste_block_drop = true;


          editor.on('focus', () => {
            // Change icon tiny
            // TODO  implement DRY.
            const $toolbar = $(editor.settings.fixed_toolbar_container);

            if ($toolbar.length && !$toolbar.find('div[aria-label="Font Sizes"] .text-size').length) {
              setTimeout(() => {
                $toolbar.find('div[aria-label="Font Sizes"] button:first').empty();
                $toolbar.find('div[aria-label="Font Sizes"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
              });
            }
            if ($toolbar.length && !$toolbar.find('div[aria-label="Font Family"] .text-size').length) {
              setTimeout(() => {
                $toolbar.find('div[aria-label="Font Family"] button:first').empty();
                $toolbar.find('div[aria-label="Font Family"] button:first').append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-font"></i>');
              });
            }
            if ($toolbar.length && !$toolbar.find('button:contains("Formats")').length) {
              setTimeout(() => {
                const $button = $toolbar.find("button:contains('Formats')");
                $button.parent('div').attr('aria-label', 'Font Format');
                $button.empty();
                $button.append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-text-size"></i>');
              });
            }
            if ($toolbar.length && !$toolbar.find("div[aria-label='Format']").length) {
              setTimeout(() => {
                $toolbar.find('div[aria-label="Format"] button:first').empty();
                $toolbar.find('div[aria-label="Format"] button:first')
                  .append('<i class="mce-caret"></i><i class="stx-toolbar-icon glyphicon glyphicon-bold"></i>');
              });
            }
            // set toolbar width
            if ($toolbar.length) {
              setTimeout(() => {
                const toolboxGroups = $toolbar.find('.mce-btn-group');
                let toolbarWidth = 0;
                toolboxGroups.each(function (i) {
                  toolbarWidth += $(this).width() + (i === 0 ? 2 : 7);
                });
                $toolbar.find('.mce-container-body').width(toolbarWidth);
                $toolbar.find('.mce-panel').width(toolbarWidth);
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
              // Is tab and it is editing a list
              if (e.keyCode === 9 && editor.dom.getParent(editor.selection.getStart(), 'li')) {
                _this.setListStyles();
              }

              if (!(_this.tinyMax() || _this.tinyMaxLines() || _this.tinyMin())) {
                // if truncate is NAN, returns and avoid validations
                return;
              }

              // Check for Min Characters Limit
              _this.minCharsValidation(e);

              // Check for Characters Limit
              _this.maxCharsValidation(e);

              // Check for Lines Limit
              _this.maxLinesValidation(e);
            })
            .on('change', () => {
              _this.setStyles();
            })
            .on('ExecCommand', (e) => {
              if (e.command.includes('Justify')) {
                const selectedList = editor.dom.getParent(editor.selection.getStart(), 'li');
                if (selectedList) _this.setListAlignment(selectedList, e.command);
              }
              if (e.command === 'mceInsertContent' && $(e.value)[0].nodeName === 'A') {
                _this.setLinkStyles();
              }
              // Emit this event in order to update tiny content when styles are changed.
              editor.bodyElement.dispatchEvent(new Event('tiny-style-change'));
            });
          listStylesFix(editor);
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
          const selectionLength = editor.selection.getContent({ format: 'text' }).length;
          const charsToPaste = (tinyMax - tinyLength) + selectionLength;

          if (cleanTxt.length > charsToPaste) {
            args.content = cleanTxt.trim().substring(0, charsToPaste);
          } else {
            args.content = cleanTxt.trim();
          }
        },
      };

      if (!_.isEmpty(options)) {
        _.each(options, (option) => {
          if (option.key === 'forecolor') {
            if (!_.isEmpty(option.textcolor_map) && !option.textcolor_from_library) {
              settings.textcolor_map = this.adapter(option.textcolor_map, 'forecolor');
            } else if (option.textcolor_from_library && Application.utils.isJsonString(this.libraryConfig.colorPalettes)) {
              settings.textcolor_map = JSON.parse(this.libraryConfig.colorPalettes)[option.palette_name];
            }
          }

          if (option.key === 'backcolor') {
            if (!_.isEmpty(option.backcolor_map) && !option.backcolor_from_library) {
              settings.backcolor_map = this.adapter(option.backcolor_map, option.key);
            } else if (option.backcolor_from_library && Application.utils.isJsonString(this.libraryConfig.colorPalettes)) {
              settings.backcolor_map = JSON.parse(this.libraryConfig.colorPalettes)[option.palette_name];
            }
            if (!_.isEmpty(option.backcolor_map) || option.backcolor_from_library) {
              settings.plugins = [settings.plugins, 'stbackcolorextended'].join(' ');
            }
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
      tinymce.get(this.editorId).destroy();
    },
  },
};
