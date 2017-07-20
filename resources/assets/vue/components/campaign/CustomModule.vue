<template>
  <div v-html="module.template"></div>
</template>

<script>
  module.exports = {
    name: 'Module',
    props: ['moduleId'],
    computed: {
      module() {
        const idx = this.moduleId;
        return this.$store.state.campaign.modules[idx];
      }
    }
  };
</script>