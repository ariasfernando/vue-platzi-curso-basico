<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6">
        <label class="clearfix control-label" for="height">Height</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="height"
          :value="height"
          :class="{'clearfix': true, 'is-danger': errors.has('height') }"
          :min="1"
        ></el-input-number>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "input-height",
  props: ["setting"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "height"
    };
  },
  computed: {
    height: {
      get: function() {
        return _.parseInt(this.component.style[this.name]);
      },
      set: function(newValue) {
        this.$emit("style-setting-updated", { name: this.name, value: `${newValue}px` });
      }
    },
  }
};
</script>