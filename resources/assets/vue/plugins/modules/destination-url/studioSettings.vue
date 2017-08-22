<template>
  <div :class="'plugin-' + plugin.name">

    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="enabled" color="#78DCD6" :sync="true" :labels="true" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>
    </form>

  </div>
</template>

<script>
  export default {
    props: ['name'],
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const module = this.module,
              columnId = this.currentComponent.columnId,
              componentId = this.currentComponent.componentId;

        const plugin = module.structure.columns[columnId].components[componentId].plugins[this.name];
        this.enabled = plugin.enabled;

        return plugin;
      }
    },
    data() {
      return {
        enabled: false
      }
    },
    methods: {
      toggle(e) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: e.value,
        };

        this.$store.commit('module/togglePlugin', payload);
      },
    }
  }
</script>