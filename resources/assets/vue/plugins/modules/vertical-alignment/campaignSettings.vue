<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-field addons>
        <stui-button
          size="mini"
          :active="value === 'top'"
          highlight
          expanded
          @click="changeAlignment('top')">
          <i class="glyphicon glyphicon-object-align-top" />
        </stui-button>
        <stui-button
          size="mini"
          :active="value === 'middle'"
          highlight
          expanded
          @click="changeAlignment('middle')">
          <i class="glyphicon glyphicon-object-align-horizontal" />
        </stui-button>
        <stui-button
          size="mini"
          :active="value === 'bottom'"
          highlight
          expanded
          @click="changeAlignment('bottom')">
          <i class="glyphicon glyphicon-object-align-bottom" />
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
      subComponent: 'container',
    };
  },
  computed: {
    value() {
      return this.element.container.attribute.valign;
    },
  },
  methods: {
    changeAlignment(value) {
      this.saveAttributeInThisElement({property: 'valign', value});
    },
  },
};
</script>
