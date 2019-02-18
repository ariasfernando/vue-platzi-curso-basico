<template>
  <settings-container :label="label" custom-class="width-setting">
    <template slot="setting-right">
      <stui-input-number
        v-model="mainSettingNumeric"
        v-validate="'required'"
        :min="minValueCalculated"
        :max="maxValueCalculated"
        class="padding-custom"
        :controls="false" />
    </template>
  </settings-container>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'Width',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    isPxWidth: {
      get() {
        return this.element.styleOption.isPxWidth;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'isPxWidth',
          value,
        });
      },
    },
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(value) {
        let newValue =
          isNaN(value) || value < this.minValueCalculated
            ? this.minValueCalculated
            : value;
        newValue = this.isPxWidth ? `${newValue}` : `${newValue}%`;
        this.mainSetting = newValue;
      },
    },
    minValueCalculated() {
      return this.minValue ? this.minValue : 1;
    },
    maxValueCalculated() {
      return this.isPxWidth ? undefined : 100;
    },
  },
  watch: {
    element: {
      handler() {
        this.defineStyleOption();
      },
      deep: true,
    },
  },
  mounted() {
    this.defineStyleOption();
  },
  methods: {
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.element.styleOption.isPxWidth === undefined) {
        this.isPxWidth = false;
      }
    },
  },
};
</script>
