<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="half"><b>{{ plugin.title }}</b></label>
        <div class="half-style-setting padding-top">
          <span>
            <toggle-button :value="enabled" active-color="#78DCD6" @change="toggle"></toggle-button>
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
      toggle(value) {
        const payload = {
          plugin: this.name,
          enabled: value,
        };

        this.$store.commit('module/togglePlugin', payload);
      }
    }
  }
</script>