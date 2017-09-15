<template>
  <div>
    <image-editor-modal :params="module.params"></image-editor-modal>
  </div>
</template>

<script>
  import imageEditorModal from './image-editor/imageEditorModal.vue';

  export default {
    props: ['module'],
    components: {
      imageEditorModal
    }
  }
</script>