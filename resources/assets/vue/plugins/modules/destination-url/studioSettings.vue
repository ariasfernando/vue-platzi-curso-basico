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

      <div v-if="plugin.enabled" class="form-group">
        <label class="col-sm-7 control-label" data-name="required"><b>Required</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.config.required" name="required" color="#78DCD6" :sync="true" :labels="true" @change="updateField"></toggle-button>
          </span>
        </div>
      </div>

      <div v-if="plugin.enabled" class="form-group">
        <label class="col-sm-7 control-label" data-name="target"><b>Target</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.config.target" name="target" color="#78DCD6" :sync="true" :labels="true" @change="updateField"></toggle-button>
          </span>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
    },
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
      updateField(e) {

        const option = e.srcEvent.target.parentElement.attributes.getNamedItem('name').value;
        const config = {};
        config[option] = e.value;

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config,
        };

        this.$store.commit('module/savePlugin', payload);
      },
    }
  }
</script>