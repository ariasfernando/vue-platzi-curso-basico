<template>
  <div class="plugin-wrapper-inner" v-if="component">
    <label>{{ plugin.title }}</label>
    
    <div class="alignment-options">
      <a v-for="option in options" 
         :data-tooltip="option"
         :data-value="value"
         :class="option === value  ? 'plugin-setting-active' : ''"
         @click="change"
      >
        <i :class="'glyphicon glyphicon-align-'+ option"
           :data-tooltip="option"
        ></i>
      </a>
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
        return this.component.attribute ? this.component.attribute.align : '';
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      change(e) {
        console.log(e.target.getAttribute('data-tooltip'));
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'align',
          attributeValue: e.target.getAttribute('data-tooltip'),
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      }
    },
  }
</script>