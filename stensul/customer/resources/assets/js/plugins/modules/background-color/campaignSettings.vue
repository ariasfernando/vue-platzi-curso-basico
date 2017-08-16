<template>
  <div>
    <label>{{ plugin.title }}</label><br>
    <compact-picker ref="compact" v-model="colors" @input="updateValue"></compact-picker>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'

  export default {
    props: ['name', 'plugin'],
    components: {
      'compact-picker': Compact
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    data() {
      return {
        defaultColors: this.plugin.config.defaultColors,
        colors: {
          hex: this.plugin.data.backgroundColor || this.plugin.config.defaultValue,
        }
      }
    },
    methods: {
      updateValue(value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: {
            backgroundColor: value.hex,
          },
          attribute: 'bgcolor',
          attributeValue: value.hex,
        };

        this.$store.commit('campaign/savePlugin', payload);
        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    }
  }
</script>