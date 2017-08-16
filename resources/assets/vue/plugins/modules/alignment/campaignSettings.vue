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
      change() {
        const payload = {
          plugin: this.name,
          moduleId: this.moduleId,
          columnId: this.columnId,
          componentId: this.componentId,
          data: {
            alignment: this.value,
          }
        };

        this.$store.commit('campaign/changePlugin', payload);
      }
    }
  }
</script>