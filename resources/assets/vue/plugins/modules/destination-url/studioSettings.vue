<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer label="Required">
        <template slot="setting-right">
          <StuiToggleButton v-if="$can('std-'+component.type+'-plugin-destination-url-validate')" :value="plugin.config.validations.required" @change="(value)=>updatePluginConfig({ value, path: 'validations.required' })" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Validate URL">
        <template slot="setting-right">
          <StuiSelect
            v-if="$can('std-'+component.type+'-plugin-destination-url-validations')"
            size="mini"
            :value="validationValue"
            :list="validateOptions"
            @change="(value) => updatePluginConfig({ value, path: 'validations.url.selected' })" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Target">
        <template slot="setting-right">
          <StuiToggleButton v-if="$can('std-'+component.type+'-plugin-destination-url-target')" :value="plugin.config.target" @change="(value)=>updatePluginConfig({ value, path: 'target' })" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Title">
        <template slot="setting-right">
          <StuiToggleButton :value="plugin.config.title" @change="(value)=>updatePluginConfig({ value, path: 'title' })" />
        </template>
      </SettingsContainer>
    </b-collapse>
  </div>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      validateOptions:
      [
        {
          value:'disabled',
          label: 'No Validation',
        },
        {
          value:'url',
          label: 'Validate Format',
        },
        {
          value:'urlAndDestination',
          label: 'Format and Destination',
        }
      ],
    };
  },
  computed: {
    validationValue() {
      return this.plugin.config.validations.url.selected;
    },
  },
  watch: {
    component: {
      handler() {
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
