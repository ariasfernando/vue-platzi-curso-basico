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

      <div class="form-group">
        <label class="col-sm-7 control-label">Default Url</label>
        <div class="col-sm-5">
          <span>
            <input type="text" :value="href" @change="change">
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
        href: this.plugin.data.href || this.plugin.config.defaultUrl
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
      },
      change(e) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'href',
          attributeValue: e.target.value,
        };

        this.$store.commit('module/saveComponentAttribute', payload);
      }
    }
  }
</script>