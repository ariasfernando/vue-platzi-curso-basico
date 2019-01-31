<template>
  <SettingsContainer
    custom-class="field-padding"
    :label="label"
    :no-label="noLabel">
    <template slot="setting-bottom">
      <stui-field grouped>
        <div class="control is-expanded">
          <Padding
            :element="element"
            :side="'Top'"
            @setting-updated="settingUpdatedHandler" />
        </div>
        <div class="control is-expanded">
          <Padding
            :element="element"
            :side="'Right'"
            @setting-updated="settingUpdatedHandler" />
        </div>
        <div class="control is-expanded">
          <Padding
            :element="element"
            :side="'Bottom'"
            @setting-updated="settingUpdatedHandler" />
        </div>
        <div class="control is-expanded">
          <Padding
            :element="element"
            :side="'Left'"
            @setting-updated="settingUpdatedHandler" />
        </div>
      </stui-field>
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
