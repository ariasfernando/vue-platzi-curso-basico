<template>

</template>

<script>

  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    data() {
      return {}
    },
    created() {
      const options = _.filter(this.plugin.data.options, 'value');
      let toolbar = [];

      _.each(options, (option) => {
        toolbar.push(option.key)
      });
      this.$store.commit('campaign/setEditorOptions', toolbar.join(' '));
    }
  }
</script>