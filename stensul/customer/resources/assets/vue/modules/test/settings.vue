<template>
  <toggle-element
    :plugin="dataToggleElement"
    >
  </toggle-element>
</template>

<script>
  import _ from "lodash";
  import config from "stensul/plugins/modules/toggle-element";
  import toggleElement from "stensul/plugins/modules/toggle-element/campaignSettings.vue";

  export default {
    props: ['moduleId'],
    components: {
      toggleElement
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      dataToggleElement() {
        _.extend(config.data, this.module.params.toggleElement);
        return config;
      },
    },
  }
</script>