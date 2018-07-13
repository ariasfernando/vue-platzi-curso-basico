<template>
  <div class="stx-wrapper" v-html="content"></div>
</template>

<script>
  export default {
    props: ['component','module','columnId','componentId'],
    data: function() {
      return {
        id: 'comment-' + this._uid,
        width: 0,
        height: 0,
        text: "",
      }
    },
    computed: {
      editorId(){
        return ['editor', this.module.idInstance, this.columnId, this.componentId].join('-');
      },
      content() {
        return `<!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" 
                    href="${this.href}" 
                    style="height:${this.height}pt; v-text-anchor:middle; width:${this.width}pt;" 
                    arcsize="${this.arcSize}%" 
                    strokecolor="${this.borderColor}"  
                    fillcolor="${this.bgColor}">
                    <w:anchorlock/>
                    <v:textbox inset="0,0,0,0"><center style="${this.textStyles}">${this.text}</center></v:textbox>
                  </v:roundrect>
                <![endif]-->`;
      },
      arcSize() {
        const percent = Math.ceil((this.borderRadius * 100) / this.height);
        return percent;
      },
      borderColor() {
        if(this.component.button.style.borderTopColor == this.component.button.style.borderBottomColor &&
          this.component.button.style.borderTopColor == this.component.button.style.borderLeftColor &&
          this.component.button.style.borderTopColor == this.component.button.style.borderBottomColor ){
          return this.component.button.style.borderTopColor;
        }
        return this.bgColor;
      },
      borderRadius() {
        return Math.ceil(this.convertToPt(parseInt(this.component.button.style.borderRadius)));
      },
      bgColor() {
        return this.component.button.attribute.bgcolor;
      },
      textStyles() {
        const element = this.component.button;
        let style = `text-align: ${element.attribute.align || 'left'};`;
        style += `font-family: ${element.style.fontFamily};`;
        style += `color: ${element.style.color};`;
        style += `font-size: ${element.style.fontSize};`;
        style += `font-weight: ${element.style.fontWeight};`;
        style += `letter-spacing: ${element.style.letterSpacing};`;
        style += `line-height: ${element.style.lineHeight};`;
        return style;
      },
      href() {
        return  this.component.button.attribute.href;
      }
    },
    methods: {
      convertToPt(value){
        return Math.ceil(parseInt(value) * 0.75);
      },
      setWidth() {
        const paddingLeft = this.component.button.style.paddingLeft ? parseInt(this.component.button.style.paddingLeft) : 0;
        const paddingRight = this.component.button.style.paddingRight ? parseInt(this.component.button.style.paddingRight) : 0;
        const minWidth = this.component.button.style.minWidth ? parseInt(this.component.button.style.minWidth) : 0;
        const editorWidth = $("#"+this.editorId).width() + paddingLeft + paddingRight;
        let width = this.component.button.attribute.width;
        if(minWidth){
          width = editorWidth > minWidth ? editorWidth : minWidth;
        }
        this.width = this.convertToPt(width);
      },
      setHeight() {
        const paddingTop = this.component.button.style.paddingTop ? parseInt(this.component.button.style.paddingTop) : 0;
        const paddingBottom = this.component.button.style.paddingBottom ? parseInt(this.component.button.style.paddingBottom) : 0;
        const editorHeight = $("#"+this.editorId).height() + paddingTop + paddingBottom;
        let height = this.component.button.attribute.height;
        if (editorHeight > height) {
          height = editorHeight;
        }
        this.height = this.convertToPt(height); 
      },
      setText() {
        // we get the text using jQuery instead of using component.data.text because the text is inside tinymce
        // tinymce only updates the store when the user makes text edits, and we have
        // some custom plugins that make changes to texts in tinymce without triggering a edition event
        let text = $('#'+this.editorId).html();

        // outlook doesn't support fillcolor=transparent and puts white as fallback
        // for those cases, we change all text color to black
        if(this.bgColor == "transparent"){
          text = text.replace("rgb(255, 255, 255)", "#000000").replace("#ffffff", "#000000").replace("#FFFFFF", "#000000");
        }
        this.text = text;
      }
    },
    watch: {
      component: {
        handler: function() {
          this.setWidth();
          this.setHeight();
          this.setText();
        },
        deep: true,
      },
    },
    mounted() {
      // setTimeout will execute these methods at the end, 
      // in this way we ensure that the elements exist in the DOM before getting them with jQuery
      setTimeout(() => {
        this.setWidth();
        this.setHeight();
        this.setText();
      })
    }
  }
</script>
