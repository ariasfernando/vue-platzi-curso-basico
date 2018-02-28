<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6">
        <label for="height">Height</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="heightInputData"
          :class="{'clearfix': true, 'is-danger': errors.has('height') }"
          @change="(value)=>updateHeight(value)"
          :min="1"
        ></el-input-number>
    </div>
  </div>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "input-height",
  props: ["setting"],
  mixins: [ SettingMixin ],
  data() {
    return {
      name: "height",
      heightInputData: ''
    };
  },
  mounted() {
    this.heightInputData = this.height;
  },
  computed: {
    height: {
      get: function() {
        return this.component.style[this.name].replace("px", "");
      },
      set: function(newValue) {
        this.$emit("style-setting-updated", { name: this.name, value: newValue });
      }
    },
  },
  methods: {
    updateHeight(newValue) {
      this.height = newValue;
    }
  }
};
</script>