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
      },
      component() {
        if (!_.isEmpty(this.currentComponent)) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          this.colors.hex = this.component.attribute.bgcolor;
          return this.$store.campaign.modules[moduleId].structure.columns[columnId].components[componentId];
        }
      }
    },
    data() {
      return {
        defaultColors: this.plugin.config.defaultColors,
        colors: {
          hex: this.plugin.config.defaultValue,
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
          attribute: 'bgcolor',
          attributeValue: value.hex,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
    mounted() {
      this.$refs.compact.defaultColors = this.defaultColors;
    }
  }
</script>