<template>
  <div>
    <a @click="prependBodyModal">Add preppended body code</a>
    <a @click="appendBodyModal">Add appended body code</a>
  </div>
</template>

<script>
  export default {
    methods: {
      prependBodyModal() {
        this.$store.commit('campaign/toggleModal', 'modalPrependBody');
      },
      appendBodyModal() {
        this.$store.commit('campaign/toggleModal', 'modalAppendBody');
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    display: block;
    color: gray;
    text-decoration: underline;
  }
  a:hover {
    cursor: pointer;
  }
</style>
