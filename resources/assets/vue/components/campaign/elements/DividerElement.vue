<template>
  <!-- DIVIDER ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
    <tr data-type="divider-element">
      <td 
        class="stx-position-relative stx-line-height-reset"
        :bgcolor="component.style.backgroundColor"
        :height="component.style.height"
        :width="component.style.width || '100%'"
        :style="styles"
      ></td>
    </tr>
  </table>
  <!-- DIVIDER ELEMENT ENDS -->
</template>

<script>
  export default {
    name: 'DividerElement',
    props: [
      'module-id',
      'column-id',
      'component-id',
      'component'
    ],
    data () {
      return {
        backgroundColor: '',
        separatorHeight: '',
        separatorWidth: ''
      }
    },
    computed: {
      styles(){
        let inlineStyle = `height:${this.component.style.height};
                          width:${this.component.style.width };
                          border-top-width:${this.component.style.borderTopWidth};  
                          border-right-width:${this.component.style.borderRightWidth};
                          border-bottom-width:${this.component.style.borderBottomWidth};
                          border-left-width:${this.component.style.borderLeftWidth};
                          border-top-style:${this.component.style.borderTopStyle};
                          border-right-style:${this.component.style.borderRightStyle};
                          border-bottom-style:${this.component.style.borderBottomStyle};
                          border-left-style:${this.component.style.borderLeftStyle};
                          border-top-color:${this.component.style.borderTopColor};
                          border-right-color:${this.component.style.borderRightColor};
                          border-bottom-color:${this.component.style.borderBottomColor};
                          border-left-color:${this.component.style.borderLeftColor};`;

        return inlineStyle;
      }
    },  
    created () {
      this.setupModule();
    },
    methods: {
      setupModule () {
        this.backgroundColor = this.component.style.backgroundColor;
        this.separatorHeight = this.component.height;
        this.separatorWidth = this.component.width;
      },
    }
  };
</script>

<style lang="less">
  .stx-line-height-reset{
    line-height: 0;
  }
</style>