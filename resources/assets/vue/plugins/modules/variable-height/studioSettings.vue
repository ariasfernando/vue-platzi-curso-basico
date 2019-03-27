<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <SettingsContainer label-left="MIN" label-right="MAX">
        <template slot="setting-half-left">
          <StuiInputNumber
            :value="plugin.config.options.min"
            :max="maxValue('min')"
            :min="minValue('min')"
            @change="(val)=>changeOption(val, 'min')" />
        </template>
        <template slot="setting-half-right">
          <StuiInputNumber
            :value="plugin.config.options.max"
            :max="maxValue('max')"
            :min="minValue('max')"
            @change="(val)=>changeOption(val, 'max')" />
        </template>
      </SettingsContainer>
    </b-collapse>
  </div>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  name: 'VariableHeight',
  components: { SettingsContainer },
  mixins: [pluginMixinAdmin],
  props: ['name'],
  computed: {
    options() {
      return this.plugin.config.options;
    },
  },
  methods: {
    maxValue(name) {
      return name === 'min' ? this.options.max - 1 : undefined;
    },
    minValue(name) {
      return name === 'max' ? this.options.min + 1 : undefined;
    },
    changeOption(valueHeight, nameHeight) {
      let maxHeight = this.plugin.config.options.max;
      let minHeight = this.plugin.config.options.min;

      if (nameHeight === 'max') {
        maxHeight = valueHeight;
      }

      if (nameHeight === 'min') {
        minHeight = valueHeight;
      }

      const value = {
        max: maxHeight,
        min: minHeight,
      };

      this.updatePluginConfig({ value });
    },
  },
};
</script>
