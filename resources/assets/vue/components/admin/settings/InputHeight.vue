<template>
    <settings-container label="Height">
      <template slot="setting-right">
        <el-input-number
            size="mini" 
            v-validate="'required'"
            v-model="height"
            :value="height"
            :min="1"
        ></el-input-number>
      </template>
    </settings-container>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "input-height",
  props: ["setting", "element", "link", "subComponent"],
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
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
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link: this.link,
          name: this.name,
          value: `${newValue}px`
        });
      }
    },
  }
};
</script>
<style lang="less" scoped>
.el-input {
  padding: 6px 0 0;
}
</style>
