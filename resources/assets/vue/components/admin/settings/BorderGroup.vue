<template>
  <div>
    <border
    :element="element"
    @setting-updated="settingUpdatedHandler"
    :side="'Top'"
    ></border>
    <border
    :element="element"
    :side="'Right'"
    @setting-updated="settingUpdatedHandler"
    ></border>
    <border
    :element="element"
    :side="'Bottom'"
    @setting-updated="settingUpdatedHandler"
    ></border>
    <border
    :element="element"
    :side="'Left'"
    @setting-updated="settingUpdatedHandler"
    ></border>
  </div>
</template>

<script>
import _ from "lodash";
import Border from "./Border.vue";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "BorderGroup",
  mixins: [ SettingMixin ],
  components: { Border },
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