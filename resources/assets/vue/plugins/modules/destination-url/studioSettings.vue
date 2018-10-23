<template>
  <div>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
        <toggle-button :value="enabled" @change="toggle"></toggle-button>
    </template>
  </settings-container>
  <template v-if="plugin.enabled">
      <settings-container label="Required">
        <template slot="setting-right">
            <toggle-button v-if="$can('std-'+component.type+'-plugin-destination-url-validate')" :value="plugin.config.validations.required" @change="(newValue)=>updateField(newValue, 'validations.required')"></toggle-button>
        </template>
      </settings-container>
      <settings-container label="Validate URL">
        <template slot="setting-right">
        <el-select
          v-if="$can('std-'+component.type+'-plugin-destination-url-validations')"
          size="mini"
          @change="(newValue) => updateField(newValue, 'validations.url.selected')"
          :value="validationValue">
          <el-option
            v-for="(opt, key) in validateOptions"
            :value="key"
            :key="key"
            :label="opt"></el-option>
        </el-select>
        </template>
      </settings-container>
      <settings-container label="Target">
        <template slot="setting-right">
            <toggle-button v-if="$can('std-'+component.type+'-plugin-destination-url-target')" :value="plugin.config.target" @change="(newValue)=>updateField(newValue, 'target')"></toggle-button>
        </template>
      </settings-container>
      <settings-container label="Title">
        <template slot="setting-right">
            <toggle-button :value="plugin.config.title" @change="(newValue)=>updateField(newValue, 'title')"></toggle-button>
        </template>
      </settings-container>
  </template>
  </div>
</template>

<script>

  import _ from 'lodash';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import pluginMixin from '../mixins/pluginMixin';

  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    mixins: [pluginMixin],
    components: { SettingsContainer },
    computed: {
      validateOptions: function(){
        return this.plugin.config.validations.url.options;
      },
      validationValue: function() {
        return this.plugin.config.validations.url.selected;
      }
    },
    watch: {
      component: {
        handler: function() {
          this.plugin.subComponent = this.component.type === 'button-element' ? 'button' : 'image';
        },
        deep: true,
      },
    },
    data() {
      return {
        enabled: false
      }
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
    }
  }
</script>