<template>
  <div class="plugin-wrapper-inner">
    <label>{{ plugin.title }}</label>
    <div class="alignment-options">
      <a data-tooltip="Left"><i class="glyphicon glyphicon-align-left"></i></a>
      <a data-tooltip="Center"><i class="glyphicon glyphicon-align-center"></i></a>
      <a data-tooltip="Right" class="plugin-setting-active"><i class="glyphicon glyphicon-align-right"></i></a>
    </div>
    <!--
    <select title="alignment" name="alignment" :value="value" @change="change">
      <option v-for="option in options" :value="option" :selected="option === value">{{ option }}</option>
    </select>
    -->
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
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      value() {
        return this.component.attribute.align;
      }
    },
    data() {
      return {
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