<template>
  <div class="plugin-wrapper-inner">
    <div>
      <span>
        <label>Destination Url</label>
        <input name="href" type="text" :value="href" @change="change">
      </span>
      <span>
        <label>Target</label>
        <div class="alignment-options">
          <a data-tooltip="_blank"><i class="glyphicon glyphicon-unchecked"></i></a>
          <a data-tooltip="_self"><i class="glyphicon glyphicon-expand"></i></a>
          <a data-tooltip="_top" class="plugin-setting-active"><i class="glyphicon glyphicon-new-window"></i></a>
        </div>

        <!-- <select name="target" @change="change">
          <option value="_blank" :selected="target">_blank</option>
          <option value="_self" :selected="target">_self</option>
          <option value="_top" :selected="target">_top</option>
        </select> -->
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
        return this.component.attribute.href;
      },
      target() {
        return this.component.attribute.target;
      }
    },
    methods: {
      change(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: e.target.name,
          attributeValue: e.target.value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      },
    },
  }
</script>