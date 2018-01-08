<template>
  <div class="plugin-wrapper-inner" v-if="component">
    <label>{{ plugin.title }}</label>
    <compact-picker ref="compact" v-model="colors" ></compact-picker>
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
      colors: {
        get() {
          return { hex: this.component.attribute ? this.component.attribute.bgcolor : this.plugin.config.defaultValue }
        },
        set(value) {
          this.updateValue('bgcolor', value);
        },
      },
    },
    data() {
      return {
        defaultColors: this.plugin.config.defaultColors,
      }
    },
    methods: {
      updateValue(attribute, value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute,
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    }
  }
</script>