<template>
  <div class="form-group" :class="'field-' + type">
    <label class="half">Height</label>
    <el-input-number
        size="mini" 
        v-validate="'required'"
        v-model="height"
        :value="height"
        class="clearfix padding-custom"
        :min="1"
      ></el-input-number>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "input-height",
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "height"
    };
  },
  computed: {
    height: {
      get: function() {
        return _.parseInt(this.element.style[this.name]);
      },
      set: function(newValue) {
        this.$emit("style-setting-updated", { name: this.name, value: `${newValue}px` });
      }
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
