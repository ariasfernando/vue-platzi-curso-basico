<script>
import StyleImageEditor from 'stensul-sie-vue';
import html2canvas from 'html2canvas';

export default {
  extends: StyleImageEditor,
  props: [
    'config',
  ],
  computed: {
    tinyOptions() {
      return _.get(this.config, 'sie-plugin-text_text.tinyOptions');
    },
  },
  mounted() {
    const inyectors = {
      'sie-plugin-text': {
        handler: this.inyectTextPlugin,
        baseProps: [
        ]
      }
    }
    $(this.$el).toggleClass('no-image-overlay-upload', !_.get(this.config, 'sie-plugin-image-overlay_image.config.overlay_upload.value', true))
    _.get(this, 'sieoptions.plugins', []).forEach((plugin) => {
      if (inyectors[plugin.type]) return inyectors[plugin.type].handler.call(this, {
        component: this,
        Plugin: plugin.definition,
        baseProps: _.pick(plugin.definition.prototype, inyectors[plugin.type].baseProps),
      });
    });
  },
  methods: {
    inyectTextPlugin({ component, Plugin, baseProps }) {
      if (Plugin.prototype['custom-inyected']) return Plugin;

      return Object.assign(Plugin.prototype, {
        'custom-inyected': true,
        async render(outputsize) {
          const { top, left } = $(this.tinyWrapper).offset();
          const canvas = await html2canvas(this.tinyWrapper, {
              logging: false,
              backgroundColor: null,
              width: this.size.width,
              height: this.size.height,
              y: outputsize.top !== 0 ? top + outputsize.top : undefined,
              x: outputsize.left !== 0 ? left + outputsize.left: undefined,
          })
          return canvas;
        },
        startMoving(event) {
          const target = event.currentTarget;
          const parent = event.currentTarget.parentElement;
          const { top: targetTop, left: targetLeft } = $(target).position();
          const eventX = event.clientX,
              eventY = event.clientY,
              targetWidth = target.clientWidth,
              targetHeight = target.clientHeight,
              parentWidth = parent.clientWidth,
              parentHeight = parent.clientHeight;

          const diffX = eventX - targetLeft,
              diffY = eventY - targetTop;

          document.onmousemove = (evt) => {
              const posX = evt.clientX,
                  posY = evt.clientY;
              let endX = posX - diffX,
                  endY = posY - diffY;

              if (endX + targetWidth > parentWidth) endX = parentWidth - targetWidth;
              if (endY + targetHeight > parentHeight) endY = parentHeight - targetHeight;
              if (endX < 0) endX = 0;
              if (endY < 0) endY = 0;

              target.style.left = endX + 'px';
              target.style.top = endY + 'px';
          };
        },
        initTiny() {
          tinymce.init(_.merge({
            selector: '.editable',
            skin: false,
            inline: true,
            plugins: ['textcolor', 'paste', 'colorpicker'],
            toolbar: this.text.toolbar,
            menubar: false,
            statusbar: false,
            fixed_toolbar_container: `#${this.toolbarId || 'tinyToolbar'}`,
            paste_as_text: true,
            content_style: 'p{ margin:0px }',
            auto_focus: this.tinyContainer.id,
            init_instance_callback: editor => (this.tinymc = editor),
            setup(editor) {
              editor.on('focus', (e) => {
                const $toolbar = $(editor.settings.fixed_toolbar_container);
                if (!$toolbar.find('div[aria-label="Font Sizes"] .text-size').length) {
                  setTimeout(() => {
                    $toolbar.find('div[aria-label="Font Sizes"] button:first')
                      .empty()
                      .addClass('stx-sie-toolbar-font-size')
                      .append('<div class="small">A</div>')
                      .append('<div class="big">A</div>')
                      .append('<i class="mce-caret">');
                  });
                }
              });
            },
          }, component.tinyOptions));
        },
      });
    }
  }
};

</script>

<style lang="less">
  #sie.no-image-overlay-upload {
    #upload {
      display: none;
    }
  }

  .toolbarWrapper {

    button[role=presentation] {
      padding: 0;

      &.stx-sie-toolbar-font-size {
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;

        .small {
          font-size: 80%;
        }

        .big {
          font-size: 120%;
        }
      }
    }

    .mce-btn {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.mce-colorbutton {
        flex-direction: column;

        .mce-preview {
          margin-left: 0;
          left: calc(50% - 8px);
          height: 3px;
        }

        .mce-open {
          position: absolute;
        }
      }
    }

    .mce-btn-group {

      &> div {
        display: flex;
        flex-direction: row;
      }
    }
  }
</style>
