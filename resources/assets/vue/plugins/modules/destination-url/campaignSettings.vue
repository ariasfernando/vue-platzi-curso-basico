<template>
  <div class="plugin-wrapper-inner" v-if="component">
    <div>
      <span>
        <label>Destination Url</label>
        <input name="href" type="text" :value="href" @change="change">
      </span>
      <span>
        <label>Target</label>
        <div class="alignment-options">
          <a v-for="(icon, option) in options" 
             name="target"
             :data-tooltip="option"
             :data-value="option"
             :class="option === target  ? 'plugin-setting-active' : ''"
             @click="change"
          >
            <i :class="'glyphicon glyphicon-'+ icon"
               :data-tooltip="option"
               @click="change"
            ></i>
          </a>
        </div>

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
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      href() {
        return this.component.attribute ? this.component.attribute.href : '';
      },
      target() {
        return this.component.attribute ? this.component.attribute.target : '';
      }
    },
    data() {
      return {
        options: this.plugin.config.options,
      }
    },
    methods: {
      change(e) {
        let valueTarget = (e.type === 'click')? e.target.getAttribute('data-tooltip'): e.target.value; 

        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: e.target.name,
          attributeValue: valueTarget,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      },
    },
  }
</script>