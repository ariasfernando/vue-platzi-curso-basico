<template>
  <div class="plugin-wrapper-inner" v-if="component">
    <label>{{ plugin.title }}</label>

    <!-- <div class="plugin-variable-value">
      <a>
        <i class="glyphicon glyphicon-minus"></i>
      </a>
      <input type="text" value="15">
        <a>
        <i class="glyphicon glyphicon-plus"></i>
      </a>
    </div> -->

    <div class="plugin-upload">
      <input 
        type="number" 
        name="variable-height"
        class="variable-height" 
        ref="variableHeight" 
        :max="options.max" 
        :min="options.min"
        :value="height"
        @input="updateStyle('variableHeight')">
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['name', 'plugin'],
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.modules[moduleId].structure.columns[columnId].components[componentId];
        }

        return component;
      },
      height(){
        return _.parseInt(this.component.style.height);
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
    
      updateStyle(field){ 
        const value = this.$refs[field].value;
        
        if ( +value < +this.plugin.config.options.min || +value > +this.plugin.config.options.max  ){
          return false;
        }

        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: 'height',
          value: value +'px',
        };

        this.$store.commit('campaign/saveComponentStyle', payload);
      }
    }
  }
</script>

<style lang="less">
  .variable-height{
    width: 100%;
    text-align: center;
  }
</style>