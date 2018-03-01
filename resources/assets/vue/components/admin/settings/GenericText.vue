<template>
  <div class="form-group" :class="'field-' + type">
    <label for="font-weight">{{ label }}</label>
        <el-input
          size="mini" 
          v-validate="'required'"
          v-model="mainSetting"
          :value="mainSetting"
          class="clearfix"
        ></el-input>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "generic-text",
  props: ["element", "name", "type", "link", "label", "default-value"],
  mixins: [SettingMixin],
};
</script>