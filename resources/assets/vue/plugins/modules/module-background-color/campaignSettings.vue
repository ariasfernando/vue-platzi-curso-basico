<template>
  <settings-container custom-class="generic-color" :label="plugin.title">
    <template slot="setting-right">
      <stui-color-picker v-model="colors"/>
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  props: ['name', 'plugin', 'moduleId'],
  data() {
    return {
      instance: Math.floor(100000 + (Math.random() * 900000)),
    };
  },
  computed: {
    colors: {
      get() {
        const value =
          this.module.structure.attribute &&
          this.module.structure.attribute.bgcolor
            ? this.module.structure.attribute.bgcolor
            : this.plugin.config.defaultValue;
        return value;
      },
      set(newValue) {
        let value = newValue;
        if (!Application.utils.validateHexVal(newValue)) {
          value = newValue === null ? '' : Application.utils.rgbToHex(newValue);
        }
        this.saveAttributeInThisElement({ property: 'bgcolor', value });
      },
    },
  },
  methods: {
    openColorPicker() {
      this.$refs[`generic-color${this.instance}`].$el.children[0].click();
    },
  },
};
</script>
