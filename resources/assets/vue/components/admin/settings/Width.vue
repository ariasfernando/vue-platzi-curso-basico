<template>
  <div class="form-group" :class="'field-' + type">
    <div class="col-xs-6">
        <label class="clearfix control-label" for="name">{{ label }}</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="mainSettingNumeric"
          :value="mainSettingNumeric"
          class="clearfix"
          :min="minValue"
          :max="maxValue"
        ></el-input-number>
    </div>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "width",
  props: ["element", "name", "type", "link", "label", "default-value", "minValue", "maxValue"],
  mixins: [SettingMixin],
  computed: {
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(newValue) {
        this.mainSetting = `${newValue}%`;
      },
    },
  }
};
</script>