<template>
  <settings-container class="input-font-weight" label="Font Weight">
    <template slot="setting-right">
      <stui-select
        v-model="fontWeight"
        :list="weightOptions" />
    </template>
  </settings-container>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'FontWeight',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      linkName: 'fontWeight',
      weightOptions: [],
    };
  },
  computed: {
    fontWeight: {
      get() {
        return this.element.style[this.linkName];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: this.linkName,
          value: newValue,
        });
      },
    },
  },
  mounted() {
    function getweightOptions() {
      const weightOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' },
      ];
      let val = 100;
      for (; val < 901;) {
        weightOptions.push({ value: val, label: val });
        val += 100;
      }
      return weightOptions;
    }
    this.weightOptions = getweightOptions();
  },
};
</script>
