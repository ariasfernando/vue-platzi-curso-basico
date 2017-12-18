<template>
  <a class="btn beta-btn-primary copy-to-clipboard" @click="copyTextArea" >Copy to clipboard <i class="fa fa-clipboard"></i></a>
</template>

<script>
  import Vue from 'vue/dist/vue';
  export default {
    name: 'CopyToClipboard',
    props : {
      textareaType: {
        type: String,
        default: ''
      }
    },
    methods: {
      data () {
        return {
          textareaType: ''
        }
      },
      copyTextArea(value) {
        this.$emit('click', value);
      }
    }
  }
</script>
<style lang="less" scoped>
  .copy-to-clipboard{
    float: right;
    z-index: 300;
    cursor: pointer!important;
    position: relative;
  }   
</style>