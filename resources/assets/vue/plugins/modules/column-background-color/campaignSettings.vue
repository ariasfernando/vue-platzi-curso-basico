<template>
  <div>
    <label>{{ plugin.title }}</label>
    <compact-picker ref="compact" v-model="colors" @input="updateValue"></compact-picker>
  </div>
</template>

<script>
  import { Compact } from 'vue-color'

  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    components: {
      'compact-picker': Compact
    },
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      column() {
        return this.modules[this.moduleId].structure.columns[this.columnId];
      },
      colors() {
        return {
          hex: this.column.attribute.bgcolor || this.plugin.config.defaultValue
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
          moduleId: this.moduleId,
          columnId: this.columnId,
          attribute: 'bgcolor',
          attributeValue: value,
        };

        this.$store.commit('campaign/saveColumnAttribute', payload);
      }
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    }
  }
</script>