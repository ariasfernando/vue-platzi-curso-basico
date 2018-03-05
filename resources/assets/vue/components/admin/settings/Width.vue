<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="half">{{ label }}</label>
    <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="mainSettingNumeric"
        :value="mainSettingNumeric"
        class="clearfix padding-custom"
        :min="minValue"
        :max="maxValue"
      ></el-input-number>
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
<style lang="less" scoped>
.el-input {
  padding: 6px 0 0 0;
}
.padding-custom {
    margin-top: 5px;
}
</style>
