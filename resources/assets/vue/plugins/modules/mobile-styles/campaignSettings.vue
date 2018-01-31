<template>

</template>

<script>
  // Default skeleton for component's plugin mobile styles
  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
    }
  }
</script>