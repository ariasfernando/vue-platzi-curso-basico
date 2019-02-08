<template>
  <SettingsContainer
    label="Letter Spacing"
    :checkbox="isNormalLetterSpacing"
    @checkboxChange="(value)=>checkboxChange(value)">
    <template slot="setting-right">
      <stui-input-number
        v-model="value"
        :step="0.05"
        :min="-5"
        :max="5"
        :disabled="!isNormalLetterSpacing"
        :false-text="valueOnFalse" />
    </template>
  </SettingsContainer>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'LetterSpacing',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      property: 'letterSpacing',
      isNormal: 'isNormalLetterSpacing',
      unit: 'em',
      valueOnTrue: 0.2,
      valueOnFalse: 'normal',
    };
  },
  computed: {
    value: {
      get() {
        const value = this.element.style[this.property] !== this.valueOnFalse
          ? parseFloat(this.element.style[this.property])
          : this.valueOnTrue;
        return value;
      },
      set(value) {
        const newValue = value + this.unit;
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: this.property,
          value: newValue,
        });
      },
    },
    isNormalLetterSpacing: {
      get() {
        return this.element.styleOption[this.isNormal];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: this.isNormal,
          value: newValue,
        });
      },
    },
  },
  mounted() {
    this.defineStyleOption();
  },
  methods: {
    checkboxChange(value) {
      const newValue = value ? this.valueOnTrue + this.unit : this.valueOnFalse;
      this.$emit('setting-updated', {
        subComponent: this.subComponent,
        link: 'style',
        name: this.property,
        value: newValue,
      });
      this.isNormalLetterSpacing = value;
    },
    defineStyleOption() {
      // set styleOption to default if is undefined
      if (this.element.styleOption.isNormalLetterSpacing === undefined) {
        this.isNormalLetterSpacing = false;
      }
    },
  },
};
</script>

