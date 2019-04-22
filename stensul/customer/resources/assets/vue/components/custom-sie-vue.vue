<script>
import StyleImageEditor from 'stensul-sie-vue';

export default {
  extends: StyleImageEditor,
  props: [
    'tinyOptions',
  ],
  mounted() {
    const self = this;
    _.get(this, 'sieoptions.plugins', []).forEach((plugin) => {
      if (plugin.type === 'sie-plugin-text' && !plugin.definition.prototype.inyected) {
        Object.assign(plugin.definition.prototype, {
          inyected: true,
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
            }, self.tinyOptions));
          },
        });
      }
    });
  },
};

</script>
