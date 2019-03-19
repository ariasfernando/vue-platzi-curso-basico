<template>
  <settings-container
    label="Width"
    :checkbox="!checkboxValue"
    @checkboxChange="(value)=>checkboxChange(value)">
    <template slot="setting-right">
      <stui-input-number
        v-model="width"
        class="control control--left is-expanded"
        false-text="auto"
        :disabled="checkboxValue"
        :step="1"
        :min="1" />
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ButtonWidth',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  computed: {
    width: {
      get() {
        return this.element.attribute.width;
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: 'button',
          link: 'attribute',
          name: 'width',
          value: newValue,
        });
      },
    },
    autoWidth: {
      get() {
        return this.element.styleOption.autoWidth;
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: 'autoWidth',
          value: newValue,
        });
      },
    },
    checkboxValue() {
      return this.autoWidth === undefined ? false : this.autoWidth;
    },
  },
  methods: {
    checkboxChange(value) {
      this.autoWidth = !value;
    },
  },
};
</script>
