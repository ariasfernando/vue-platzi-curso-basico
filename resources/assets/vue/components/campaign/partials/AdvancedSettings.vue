<template>
  <div>
    <a v-if="canAccessPrependBody" @click="prependBodyModal">Add preppended body code</a>
    <a v-if="canAccessAppendBody" @click="appendBodyModal">Add appended body code</a>
  </div>
</template>

<script>
  export default {
    computed: {
      canAccessPrependBody() {
        return this.$can('access_prepend_body');
      },
      canAccessAppendBody() {
        return this.$can('access_append_body');
      },
    },
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
