<template>
  <div>
    <label>{{ plugin.title }}</label><br>
    <select title="alignment" name="alignment" :value="value" @change="change">
      <option v-for="option in options" :value="option" :selected="option === value">{{ option }}</option>
    </select>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        if (!_.isEmpty(this.currentComponent)) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          this.value = this.component.attribute.align;
          return this.$store.campaign.modules[moduleId].structure.columns[columnId].components[componentId];
        }
      }
    },
    data() {
      return {
        value: this.plugin.config.defaultValue,
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
          attribute: 'align',
          attributeValue: e.target.value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
  }
</script>