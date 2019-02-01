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
          <StuiToggleButton v-if="$can('std-'+component.type+'-plugin-destination-url-validate')" :value="plugin.config.validations.required" @change="(newValue)=>updateField(newValue, 'validations.required')" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Validate URL">
        <template slot="setting-right">
          <ElSelect
            v-if="$can('std-'+component.type+'-plugin-destination-url-validations')"
            size="mini"
            :value="validationValue"
            @change="(newValue) => updateField(newValue, 'validations.url.selected')">
            <ElOption
              v-for="(opt, key) in validateOptions"
              :key="key"
              :value="key"
              :label="opt" />
          </ElSelect>
        </template>
      </SettingsContainer>
      <SettingsContainer label="Target">
        <template slot="setting-right">
          <StuiToggleButton v-if="$can('std-'+component.type+'-plugin-destination-url-target')" :value="plugin.config.target" @change="(newValue)=>updateField(newValue, 'target')" />
        </template>
      </SettingsContainer>
      <SettingsContainer label="Title">
        <template slot="setting-right">
          <StuiToggleButton :value="plugin.config.title" @change="(newValue)=>updateField(newValue, 'title')" />
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
