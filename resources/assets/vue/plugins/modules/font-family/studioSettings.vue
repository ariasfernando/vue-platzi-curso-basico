<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
          <toggle-button :value="enabled" @change="toggle"></toggle-button>
      </template>
    </settings-container>

    <settings-container label="Fonts options" v-if="enabled">
      <template slot="setting-right">
          <el-input
            size="mini" 
            v-model="fontsOptions"
          ></el-input>
      </template>
    </settings-container>
    </div>
</template>
<script>
import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
import pluginMixin from "../mixins/pluginMixin";
export default {
  props: ["name"],
  components: { SettingsContainer },
  mixins: [pluginMixin],
  computed: {
    fontsOptions: {
      get() {
        return JSON.stringify(this.plugin.config);
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          const payload = {
            plugin: this.name,
            columnId: this.currentComponent.columnId,
            componentId: this.currentComponent.componentId,
            value: JSON.parse(value)
          };
          this.$store.commit("module/setPluginComponentConfig", payload);
        }
      }
    }
  },
  watch: {
    component: {
      handler: function() {
        switch (this.component.type) {
          case "button-element":
            this.plugin.subComponent = "button";
            break;
          case "text-element":
            this.plugin.subComponent = "text";
            break;
          default:
            break;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      enabled: false
    };
  },
  methods: {
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value
      };

      this.$store.commit("module/togglePlugin", payload);
    }
  }
};
</script>