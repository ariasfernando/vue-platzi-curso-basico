<template>
  <settings-container custom-class="field-padding" :label="label">
    <template slot="setting-bottom">
      <padding
      :element="element"
      @setting-updated="settingUpdatedHandler"
      :side="'Top'"
      ></padding>
      <padding
      :element="element"
      :side="'Right'"
      @setting-updated="settingUpdatedHandler"
      ></padding>
      <padding
      :element="element"
      :side="'Bottom'"
      @setting-updated="settingUpdatedHandler"
      ></padding>
      <padding
      :element="element"
      :side="'Left'"
      @setting-updated="settingUpdatedHandler"
      ></padding>
    </template>
  </settings-container>
</template>

<script>
import _ from "lodash";
import Padding from "./Padding.vue";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "PaddingGroup",
  mixins: [ SettingMixin ],
  components: { Padding, SettingsContainer },
  methods: {
    settingUpdatedHandler(eventData) {
      this.$emit("setting-updated", {
        subComponent: this.subComponent,
        link: 'style',
        name: eventData.name,
        value: eventData.value
      });
    }
  }
};
</script>