<template>
  <div>
    <label>{{ plugin.title }}</label><br>
    <compact-picker ref="compact" v-model="colors" @input="updateValue"></compact-picker>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'

  export default {
    props: ['name', 'plugin', 'moduleId'],
    components: {
      'compact-picker': Compact
    },
    computed: {
      currentModule() {
        return this.$store.getters["campaign/currentModule"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentModule];
      },
      colors() {
        return {
          hex: this.module.structure.attribute.bgcolor || this.plugin.config.defaultValue
        }
      },
    },
    data() {
      return {
        defaultColors: this.plugin.config.defaultColors,
      }
    },
    methods: {
      updateValue(value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentModule,
          attribute: 'bgcolor',
          attributeValue: value,
        };

        this.$store.commit('campaign/saveModuleAttribute', payload);
      }
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    }
  }
</script>