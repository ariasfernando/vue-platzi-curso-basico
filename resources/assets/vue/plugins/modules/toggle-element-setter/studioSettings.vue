<template>
  <div>
    <settings-container :label="plugin.title">
      <template slot="setting-right">
        <toggle-button :value="isSet" @change="toggle" />
      </template>
    </settings-container>
    <settings-container v-if="isSet" label="Label">
      <template slot="setting-right">
        <el-input
          v-model="value"
          size="mini" />
      </template>
    </settings-container>
  </div>
</template>
<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import pluginMixin from '../mixins/pluginMixin';

export default {
  components: { SettingsContainer },
  mixins: [pluginMixin],
  props: ['name', 'element'],
  computed: {
    value: {
      get() {
        let value = false;
        _.each(this.module.plugins.toggleElement.data.elements, (element) => {
          if (element.id === this.element.id) {
            value = element.label;
          }
          return !value;
        });
        return value;
      },
      set(value) {
        let found = false;
        let index = false;
        const elements = _.cloneDeep(this.module.plugins.toggleElement.data.elements || []);
        _.each(elements, (element, i) => {
          if (element.id === this.element.id) {
            found = true;
            index = i;
          }
          return !found;
        });

        if (value !== false) {
          if (found) {
            elements[index].label = value;
          } else {
            elements.push({ id: this.element.id, label: value });
          }
        } else if (found) {
          elements.splice(index, 1);
        }
        const payload = {
          plugin: 'toggleElement',
          path: 'elements',
          type: 'data',
          value: elements,
        };
        this.$store.commit('module/setPluginElementConfig', payload);

        const enabled = elements.length !== 0;
        this.$store.commit('module/togglePlugin', { plugin: 'toggleElement', enabled });
      },
    },
    isSet() {
      return this.value !== false;
    },
  },
  methods: {
    toggle(value) {
      this.value = value !== false ? _.startCase(this.element.type.replace('-element', '')) : false;
    },
  },
};
</script>
