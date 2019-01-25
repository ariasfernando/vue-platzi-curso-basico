<template>
  <settings-container custom-class="field-padding" :label="label">
    <template slot="setting-bottom">
      <padding
        :element="element"
        :side="'Right'"
        @setting-updated="settingUpdatedHandler" />
      <padding
        :element="element"
        :side="'Left'"
        @setting-updated="settingUpdatedHandler" />
    </template>
  </settings-container>
</template>

<script>
import Padding from './Padding.vue';
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'HorizontalPaddingGroup',
  components: { Padding, SettingsContainer },
  mixins: [SettingMixin],
  methods: {
    settingUpdatedHandler(eventData) {
      this.$emit('setting-updated', {
        subComponent: this.subComponent,
        link: 'style',
        name: eventData.name,
        value: eventData.value,
      });
    },
  },
};
</script>
