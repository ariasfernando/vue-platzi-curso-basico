<template>
  <div>
    <label>{{ plugin.title }}</label>
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
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      colors() {
        return {
          hex: this.component.attribute.bgcolor || this.plugin.config.defaultValue
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
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'bgcolor',
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    }
  }
</script>