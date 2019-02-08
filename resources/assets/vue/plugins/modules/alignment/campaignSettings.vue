<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-field addons>
        <stui-button
          v-for="option in options"
          :key="option"
          size="mini"
          :active="value === option"
          :data-tooltip="option"
          highlight
          expanded
          @click="changeAlignment(option)">
          <i :class="`fa fa-align-${option}`" />
        </stui-button>
      </stui-field>
    </template>
  </settings-container>
</template>

<script>
import pluginCampaignMixin from '../mixins/pluginCampaignMixin';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  mixins: [pluginCampaignMixin],
  data() {
    return {
      options: this.plugin.config.options,
    };
  },
  computed: {
    value: {
      get() {
        return this.element[this.plugin.subComponent].attribute.align;
      },
      set(value) {
        const { type, behaviour } = this.element;
        this.saveAttributeInThisElement({ property: 'align', value });
        if (type === 'button-element' && behaviour === 'text') {
          this.saveAttributeInThisElement({ subComponent: 'button', property: 'align', value });
        }
      },
    },
  },
  methods: {
    changeAlignment(option) {
      this.value = option;
    },
  },
};
</script>
