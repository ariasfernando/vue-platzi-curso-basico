<template>
  <span class="st-tag"
    v-on:click="addTag(tag)"
    v-bind:class="highlighted ? 'tag-highlight' : ''"
  >{{tag}}</span>
</template>

<script>
export default {
  props: {
    highlighted: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      required: true
    },
  },
  methods: {
    addTag: function(tag) {
      if (!this.highlighted) {
        this.$emit('add-search-tag', tag);
      }
    }
  }
}
</script>