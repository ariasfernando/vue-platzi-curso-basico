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
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const plugin = this.module.plugins[this.name];
        this.enabled = plugin.enabled;

        return plugin;
      }
    },
    data() {
      return {
        enabled: false,
      }
    },
    methods: {
      toggle(e) {
        const payload = {
          plugin: this.name,
          enabled: e.value,
        };

        this.$store.commit('module/togglePlugin', payload);
      }
    }
  }
</script>