<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <toggle-button :value="enabled" @change="toggle" />
      </template>
    </settings-container>
    <template v-if="plugin.enabled">
      <settings-container label="Required">
        <template slot="setting-right">
          <toggle-button v-if="$can('std-'+component.type+'-plugin-destination-url-validate')" :value="plugin.config.validations.required" @change="(newValue)=>updateField(newValue, 'validations.required')" />
        </template>
      </settings-container>
      <settings-container label="Validate URL">
        <template slot="setting-right">
          <el-select
            v-if="$can('std-'+component.type+'-plugin-destination-url-validations')"
            size="mini"
            :value="validationValue"
            @change="(newValue) => updateField(newValue, 'validations.url.selected')">
            <el-option
              v-for="(opt, key) in validateOptions"
              :key="key"
              :value="key"
              :label="opt" />
          </el-select>
        </template>
      </settings-container>
      <settings-container label="Target">
        <template slot="setting-right">
          <toggle-button v-if="$can('std-'+component.type+'-plugin-destination-url-target')" :value="plugin.config.target" @change="(newValue)=>updateField(newValue, 'target')" />
        </template>
      </settings-container>
      <settings-container label="Title">
        <template slot="setting-right">
          <toggle-button :value="plugin.config.title" @change="(newValue)=>updateField(newValue, 'title')" />
        </template>
      </settings-container>
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixin from '../mixins/pluginMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixin],
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      enabled: false,
    };
  },
  computed: {
    validateOptions() {
      return this.plugin.config.validations.url.options;
    },
    validationValue() {
      return this.plugin.config.validations.url.selected;
    },
  },
  watch: {
    component: {
      handler: function() {
        if (this.plugin.subComponent === undefined) {
          switch (this.component.type) {
            case 'button-element':
              this.plugin.subComponent = 'button';
              break;
            case 'image-element':
              this.plugin.subComponent = 'image';
              break;
            case 'text-element':
              this.plugin.subComponent = 'text';
              break;
            default:
              break;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    toggle(value) {
      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        enabled: value,
      };

      this.$store.commit('module/togglePlugin', payload);
    },
    updateField(value, option) {
      const config = {};

      _.set(config, option, value);

      const payload = {
        plugin: this.name,
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        config,
      };
      this.$store.commit('module/savePlugin', payload);
    },
  },
};
</script>
