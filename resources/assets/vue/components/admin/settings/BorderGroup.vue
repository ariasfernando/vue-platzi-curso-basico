<template>
  <div>
    <border
    :element="element"
    @style-setting-updated="styleSettingUpdatedHandler"
    :side="'Top'"
    ></border>
    <border
    :element="element"
    :side="'Right'"
    @style-setting-updated="styleSettingUpdatedHandler"
    ></border>
    <border
    :element="element"
    :side="'Bottom'"
    @style-setting-updated="styleSettingUpdatedHandler"
    ></border>
    <border
    :element="element"
    :side="'Left'"
    @style-setting-updated="styleSettingUpdatedHandler"
    ></border>
  </div>
</template>

<script>
import _ from "lodash";
import Border from "./Border.vue";

export default {
  name: "BorderGroup",
  props: ["setting", "element"],
  components: {
    "border": Border,
  },
  methods:{
    styleSettingUpdatedHandler(eventData) {
      this.$emit("style-setting-updated", { name: eventData.name, value: eventData.value });
    },
  }
};
</script>