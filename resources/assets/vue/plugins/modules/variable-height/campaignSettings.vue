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
        name="height"
        class="variable-height" 
        v-model="height"
        :max="options.max" 
        :min="options.min"
        :class="{'input': true, 'is-danger': errors.has('height') }"
        v-validate.initial="`between:${options.min},${options.max}`"
      >
        <span v-show="errors.has('height')" class="help is-danger">{{ errors.first('height') }}</span>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import validatorMixin from '../mixins/validator';

  export default {
    props: ['name', 'plugin'],
    mixins: [validatorMixin],
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
      height: {
        get() {
          return _.parseInt(this.component.divider.style.height);
        },
        set(value) {
          this.validate();
          this.updateStyle('height', value);
        },
      },
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      updateStyle(property, value){ 
          
          const payload = {
            plugin: this.name,
            moduleId: this.currentComponent.moduleId,
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            link: 'style',
            subComponent:"divider",
            property,
            value: value +'px',
          };

          this.$store.commit('campaign/saveComponentProperty', payload);
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