<template>
  <aside class="component-settings-wrapper" v-if="show">
    <div class="aside-inner section-box">
      <h3>Panel de configuracion</h3>
      <a href="#" @click="close">Close</a>
    </div>
  </aside>
</template>

<script>

  export default {
    props: ['moduleId'],
    computed: {
      show() {
        return this.$store.getters["campaign/currentCustomModuleId"] === this.moduleId;
      },
    },
    data () {
      return {
      }
    },
    methods: {
      close() {
        this.$store.commit("campaign/setCustomModuleId", false);
      }
    },
    created () {

    }
  };
</script>

<style lang="less" scoped>
  .modal-container {
    width: 900px;
  }
  .show {
    display: block !important;
    opacity: 1 !important;
  }
</style>