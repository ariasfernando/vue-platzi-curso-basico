<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-color-picker v-model="colors" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  data() {
    return {
      subComponent: 'container',
    };
  },
  computed: {
    colors: {
      get() {
        return this.element.container.attribute.bgcolor;
      },
      set(value) {
        this.saveAttributeInThisElement({ property: 'bgcolor', value });
      },
    },
  },
};
</script>
