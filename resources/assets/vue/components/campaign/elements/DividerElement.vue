<template>
  <!-- DIVIDER ELEMENT -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr data-type="divider-element">
      <td class="stx-position-relative stx-line-height-reset"
        :bgcolor="component.style.backgroundColor"
        :height="component.style.height"
        :width="component.style.width || '100%'"
        :style="'height:'+ component.style.height +';border-top-width:'+ component.style.borderTopWidth +';border-right-width:'+ component.style.borderRightWidth +';border-bottom-width:'+ component.style.borderBottomWidth +';border-left-width:'+ component.style.borderLeftWidth +';border-top-style:'+ component.style.borderTopStyle +';border-right-style:'+ component.style.borderRightStyle +';border-bottom-style:'+ component.style.borderBottomStyle +';border-left-style:'+ component.style.borderLeftStyle +'    ;border-top-color:'+ component.style.borderTopColor +';border-right-color:'+ component.style.borderRightColor +';border-bottom-color:'+ component.style.borderBottomColor +';border-left-color:'+ component.style.borderLeftColor +';'"></td>
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