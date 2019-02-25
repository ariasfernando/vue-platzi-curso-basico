<template>
  <div>
    <StuiButton
      v-if="canAccessPrependBody"
      width="full"
      class="mb-10"
      @click="prependBodyModal">
      Add preppended body code
    </StuiButton>
    <StuiButton
      v-if="canAccessAppendBody"
      width="full"
      @click="appendBodyModal">
      Add appended body code
    </StuiButton>
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
.mb-10 {
  margin-bottom: 10px;
}
</style>
