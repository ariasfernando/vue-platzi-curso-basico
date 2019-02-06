<template>
  <line-comment :comment="content" />
</template>

<script>
import ElementMixin from './mixins/ElementMixin';
import LineComment from './comments/LineComment.vue';

export default {
  components: { LineComment },
  mixins: [ElementMixin],
  data() {
    return {
      height: 0,
      outerHeight: 0,
      lineHeight: 0,
      fontSize: 0,
      lines: 1,
      text: '',
      textRaise: 0,
      width: 0,
    };
  },
  computed: {
    arcSize() {
      const percent = Math.round((this.borderRadius * 100) / this.height);
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
      if (this.borderWidth && this.component.button.style.borderBottomColor) {
        // we assume that all borders have the same color, could be extended in the future
        return this.component.button.style.borderBottomColor;
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
        this.convertToPt(
          parseInt(this.component.button.style.borderRadius, 10),
        ),
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
              }" style="padding: 0px; width: 100%; height:${
        this.outerHeight
      }pt;">
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
        font-size: ${this.fontSize}px;
        font-weight: ${element.style.fontWeight};
        letter-spacing: ${element.style.letterSpacing};
        mso-line-height-rule: exactly;
        line-height: ${this.lineHeight}px;`;
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
      return Math.ceil(parseInt(value, 10) * 0.75);
    },
    editorHeight() {
      return $(`#${this.editorId}`).height();
    },
    setAll() {
      // do not sort alphabetically
      this.setText();
      this.setWidth();
      this.setHeight();
      this.setFontSizeAndLineHeight();
    },
    setHeight() {
      const componentHeight = this.getComponentHeight();
      const height = Math.max(
        parseInt(this.component.button.attribute.height, 10),
        componentHeight,
      );
      this.height = this.convertToPt(height);
      this.outerHeight = this.height + (this.borderWidth * 2);
    },
    setLines() {
      const lineHeight = this.getHighestLineHeight();
      this.lines =
        this.editorHeight() >= lineHeight * 2
          ? Math.round(this.editorHeight() / lineHeight)
          : 1;
    },
    getComponentHeight() {
      const paddingTop = this.component.button.style.paddingTop
        ? parseInt(this.component.button.style.paddingTop, 10)
        : 0;
      const paddingBottom = this.component.button.style.paddingBottom
        ? parseInt(this.component.button.style.paddingBottom, 10)
        : 0;
      return this.editorHeight() + paddingTop + paddingBottom;
    },
    getHighestLineHeight() {
      const element = this.component.button;
      const elementLineHeight = parseInt(this.lineHeightCalculate(element), 10);
      const $editorSpans = $(`#${this.editorId}`).find('span');
      const editorHighestLineHeight = Math.max(
        ...$editorSpans
          .map(function() {
            return $(this).height();
          })
          .get(),
      );

      return Math.max(elementLineHeight, editorHighestLineHeight);
    },
    getHighestFontSize() {
      const element = this.component.button;
      const elementFontSize = parseInt(element.style.fontSize, 10);
      const $editorSpans = $(`#${this.editorId}`).find('span');
      const editorHighestFontSize = Math.max(
        ...$editorSpans
          .map(function () {
            return parseInt($(this).css('font-size'), 10);
          })
          .get(),
      );

      return Math.max(elementFontSize, editorHighestFontSize);
    },
    setFontSizeAndLineHeight() {
      this.setLines();
      const fontSize = this.getHighestFontSize();
      let lineHeight = this.getHighestLineHeight();

      // To prevent Outlook from cropping our text,
      // if the lineHeight exceeds 200% of the fontSize, we reduce it to a 'more razonable' percentage
      const lineHeightPercent = (lineHeight * 100) / fontSize;
      if (lineHeightPercent >= 200) {
        lineHeight = fontSize * 1.5;
      }

      // Also, reduce the lineHeight if the summatory of lineHeights exceeds the element height
      // this should not be a common issue, but can happen if the module isn't well configured
      if (lineHeight * this.lines >= this.getComponentHeight()) {
        lineHeight *= 0.75;
        if (lineHeight < fontSize) {
          lineHeight = fontSize;
        }
      }

      this.lineHeight = Math.round(lineHeight);
      this.fontSize = fontSize;
    },
    setText() {
      // we get the text using jQuery instead of using component.data.text because the text is inside tinymce
      // tinymce only updates the store when the user makes text edits, and we have
      // some custom plugins that make changes to texts in tinymce without triggering a edition event
      this.text = $(`#${this.editorId}`).html();
    },
    setWidth() {
      const style = this.component.button.style;
      const paddingLeft = style.paddingLeft
        ? parseInt(style.paddingLeft, 10)
        : 0;
      const paddingRight = style.paddingRight
        ? parseInt(style.paddingRight, 10)
        : 0;
      const minWidth = style.minWidth ? parseInt(style.minWidth, 10) : 0;

      const editorWidth =
        $(`#${this.editorId}`).width() + paddingLeft + paddingRight;
      const buttonWidth = this.component.button.attribute.width;
      const finalWidth = Math.max(editorWidth, buttonWidth, minWidth);

      this.width = this.convertToPt(finalWidth);
    },
  },
};
</script>
