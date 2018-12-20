<template>
  <SettingsContainer custom-class="field-padding" :label="label">
    <template slot="setting-bottom">
      <Padding
        :element="element"
        @setting-updated="settingUpdatedHandler"
        :side="'Top'" />
      <Padding
        :element="element"
        :side="'Right'"
        @setting-updated="settingUpdatedHandler" />
      <Padding
        :element="element"
        :side="'Bottom'"
        @setting-updated="settingUpdatedHandler" />
      <Padding
        :element="element"
        :side="'Left'"
        @setting-updated="settingUpdatedHandler" />
    </template>
  </SettingsContainer>
</template>

<script>
import Padding from './Padding.vue';
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'PaddingGroup',
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
