<template>
  <div>
    <label>{{ plugin.title }}</label><br>
    <select title="alignment" name="alignment" :value="value" @change="change">
      <option v-for="option in options" :value="option" :selected="option === value">{{ option }}</option>
    </select>
  </div>
</template>

<script>
  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      }
    },
    data() {
      return {
        value: this.plugin.data.alignment || this.plugin.config.defaultValue,
        options: this.plugin.config.options
      }
    },
    methods: {
      change(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: {
            alignment: e.target.value,
          },
          attribute: 'align',
          attributeValue: e.target.value,
        };

        this.$store.commit('campaign/savePlugin', payload);
        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    }
  }
</script>