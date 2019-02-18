<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <stui-color-picker v-model="colors" />
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
      instance: Math.floor((100000 + Math.random()) * 900000),
    };
  },
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    column() {
      return this.modules[this.moduleId].structure.columns[this.columnId];
    },
    colors: {
      get() {
        return this.column.container.attribute.bgcolor || this.plugin.config.defaultValue;
      },
      set(value) {
        const payload = {
          moduleId: this.moduleId,
          columnId: this.columnId,
          subComponent: 'container',
          link: 'attribute',
          property: 'bgcolor',
          value,
        };
        this.$store.commit('campaign/saveColumnProperty', payload);
      },
    },
  },
};
</script>
