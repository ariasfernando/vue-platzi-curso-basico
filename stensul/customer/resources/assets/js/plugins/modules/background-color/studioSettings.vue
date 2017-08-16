<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label">{{ plugin.title }}</label>
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
    props: ['name', 'plugin'],
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    data() {
      return {
        enabled: this.plugin.data.enabled || false,
      }
    },
    methods: {
      toggle(e) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          data: {
            enabled: e.value,
          }
        };

        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>