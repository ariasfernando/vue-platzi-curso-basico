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
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  props: ['name', 'plugin', 'moduleId', 'columnId'],
  data() {
    return {
      options: this.plugin.config.options,
    };
  },
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    column() {
      return this.modules[this.moduleId].structure.columns[this.columnId];
    },
    value() {
      return this.column.container.attribute.valign;
    },
  },
  methods: {
    changeAlignment(value) {
      const payload = {
        moduleId: this.moduleId,
        columnId: this.columnId,
        subComponent: 'container',
        link: 'attribute',
        property: 'valign',
        value,
      };
      this.$store.commit('campaign/saveColumnProperty', payload);
    },
  },
};
</script>
