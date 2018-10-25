<template>
  <div class="stx-wrapper" v-html="content" />
</template>

<script>
export default {
  props: ['component', 'module', 'columnId', 'componentId'],
  data() {
    return {
      height: 0,
      lineHeight: 0,
      lines: 1,
      text: '',
      textRaise: 0,
      width: 0,
    };
  },
  computed: {
    arcSize() {
      const percent = Math.round(this.borderRadius * 100 / this.height);
      return percent;
    },
    bgColor() {
      const bgColor = this.component.button.attribute.bgcolor;
      if (bgColor !== 'transparent') {
        return bgColor;
      }
      // outlook doesn't support fillcolor=transparent and puts white as fallback
      // so we search for the parent container background color and return it to simulate transparency
      if (this.component.container.attribute.bgcolor) {
        return this.component.container.attribute.bgcolor;
      } else if (
        this.module.structure.columns[this.columnId].container.attribute.bgcolor
      ) {
        return this.module.structure.columns[this.columnId].container.attribute
          .bgcolor;
      }
      return this.module.structure.attribute.bgcolor;
    },
    borderColor() {
      if (this.borderWidth) {
        if (this.component.button.style.borderBottomColor) {
          // we assume that all borders have the same color, could be extended in the future
          return this.component.button.style.borderBottomColor;
        }
        return this.bgColor;
      }
      return this.bgColor;
    },
    borderWidth() {
      // we assume that all borders have the same width, could be extended in the future
      return this.component.button.style.borderBottomWidth
        ? this.convertToPt(this.component.button.style.borderBottomWidth)
        : 0;
    },
    borderRadius() {
      return Math.ceil(
        this.convertToPt(parseInt(this.component.button.style.borderRadius)),
      );
    },
    buttonAlignment() {
      return this.component.container.attribute.align || 'center';
    },
    content() {
      return `<!--[if mso]>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td width="100%" valign="top" align="${
                this.buttonAlignment
              }" style="padding: 0px; width: 100%; height:${this.height}pt;">
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                  href="${this.href}"
                  style="height:${this.height}pt; v-text-anchor:middle; width:${
        this.width
      }pt; mso-position-horizontal: ${this.buttonAlignment};"
                  arcsize="${this.arcSize}%"
                  strokecolor="${this.borderColor}"
                  strokeweight="${this.borderWidth}pt"
                  fillcolor="${this.bgColor}">
                  <w:anchorlock/>
                  <v:textbox inset="0,0,0,0"><center style="${
                    this.textStyles
                  }">${this.text}</center></v:textbox>
                </v:roundrect>
              </td>
            </tr>
          </table>
        <![endif]-->`;
    },
    editorId() {
      return [
        'editor',
        this.module.idInstance,
        this.columnId,
        this.componentId,
      ].join('-');
    },
    href() {
      return this.component.button.attribute.href;
    },
    textStyles() {
      const element = this.component.button;
      const style = `text-align: ${element.attribute.align || 'left'};
        font-family: ${element.style.fontFamily};
        color: ${element.style.color};
        font-size: ${element.style.fontSize};
        font-weight: ${element.style.fontWeight};
        letter-spacing: ${element.style.letterSpacing};
        mso-line-height-rule: exactly;
        line-height: ${this.lineHeight}px;
        mso-text-raise: ${this.textRaise}px;`;
      return style;
    },
  },
  watch: {
    component: {
      handler() {
        this.setAll();
      },
      deep: true,
    },
  },
  mounted() {
    // setTimeout will execute these methods at the end,
    // in this way we ensure that the elements exist in the DOM before getting them with jQuery
    setTimeout(() => {
      this.setAll();
    });
  },
  methods: {
    convertToPt(value) {
      return Math.ceil(parseInt(value) * 0.75);
    },
    editorHeight() {
      return $(`#${this.editorId}`).height();
    },
    setAll() {
      // do not sort alphabetically
      this.setText();
      this.setWidth();
      this.setHeight();
      this.setLines();
      this.setLineHeight();
      this.setTextRaise();
    },
    setHeight() {
      const paddingTop = this.component.button.style.paddingTop
        ? parseInt(this.component.button.style.paddingTop)
        : 0;
      const paddingBottom = this.component.button.style.paddingBottom
        ? parseInt(this.component.button.style.paddingBottom)
        : 0;
      const componentHeight = this.editorHeight() + paddingTop + paddingBottom;
      let height = this.component.button.attribute.height;
      if (componentHeight > height) {
        height = componentHeight;
      }
      this.height = this.convertToPt(height);
    },
    setLines() {
      const element = this.component.button;
      const lineHeight = parseInt(element.style.lineHeight);
      let lines = 1;
      if (this.editorHeight() >= lineHeight * 2) {
        lines = Math.round(this.editorHeight() / lineHeight);
      }
      this.lines = lines;
    },
    setLineHeight() {
      const element = this.component.button;
      const fontSize = parseInt(element.style.fontSize);
      let lineHeight = parseInt(element.style.lineHeight);
      if (this.lines > 1) {
        if (fontSize !== lineHeight) {
          lineHeight = Math.round(lineHeight * 0.9);
        }
      }
      const lineHeightPercent = lineHeight * 100 / fontSize;
      if (lineHeightPercent >= 200) {
        lineHeight = fontSize * 1.8;
      }

      this.lineHeight = Math.round(lineHeight);
    },
    setText() {
      // we get the text using jQuery instead of using component.data.text because the text is inside tinymce
      // tinymce only updates the store when the user makes text edits, and we have
      // some custom plugins that make changes to texts in tinymce without triggering a edition event
      this.text = $(`#${this.editorId}`).html();
    },
    setTextRaise() {
      const element = this.component.button;
      const fontSize = parseInt(element.style.fontSize);
      const raiseRatio = (this.lineHeight - fontSize) / 2;
      this.textRaise = Math.round(raiseRatio);
    },
    setWidth() {
      const paddingLeft = this.component.button.style.paddingLeft
        ? parseInt(this.component.button.style.paddingLeft)
        : 0;
      const paddingRight = this.component.button.style.paddingRight
        ? parseInt(this.component.button.style.paddingRight)
        : 0;
      const minWidth = this.component.button.style.minWidth
        ? parseInt(this.component.button.style.minWidth)
        : 0;
      const editorWidth =
        $(`#${this.editorId}`).width() + paddingLeft + paddingRight;
      let width = this.component.button.attribute.width;
      if (minWidth || width === 0) {
        width = editorWidth > minWidth ? editorWidth : minWidth;
      }
      this.width = this.convertToPt(width);
    },
  },
};
</script>
