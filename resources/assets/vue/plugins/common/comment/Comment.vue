<template>
  <span :id="id"></span>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        id: 'comment-' + this._uid
      }
    },
    mounted() {
      let comment = document.createComment(this.content);
      let commentContainer = document.getElementById(this.id);

      commentContainer.parentNode.insertBefore(comment, commentContainer);
      commentContainer.parentNode.removeChild(commentContainer);
    }
  }
</script>