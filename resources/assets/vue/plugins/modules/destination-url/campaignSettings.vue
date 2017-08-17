<template>
  <div>
    <label>{{ plugin.title }}</label>
    <div>
      <span>
        <input name="destination-url" type="text" :value="href" @change="change">
      </span>
    </div>

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
        const moduleId = this.currentComponent.moduleId;
        const columnId = this.currentComponent.columnId;
        const componentId = this.currentComponent.componentId;

        return this.$store.state.campaign.modules[moduleId].structure.columns[columnId].components[componentId];
      },
      href() {
        return this.component.attribute.href || this.plugin.config.defaultUrl;
      }
    },
    methods: {
      change(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'href',
          attributeValue: e.target.value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
  }
</script>