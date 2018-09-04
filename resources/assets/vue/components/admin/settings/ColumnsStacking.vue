<template>
  <settings-container v-if="element.columns.length > 1" label="columnsStacking">
    <template slot="setting-bottom">
      <el-select
      class="width-full"
      :placeholder="label"
      v-model="mainSetting"
      size="mini"
      >
        <el-option
          v-for="item in columnsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "ColumnsStacking",
  mixins: [SettingMixin],
  components: { SettingsContainer },

  computed: {
    columnsOptions() {
      let columnsOptions = [];
      if (this.element.columns.length > 1) {
        columnsOptions.push(
          {
            value: "normal",
            label: "Normal"
          },
          {
            value: "columnsFixed",
            label: "Columns fixed"
          }
        );
      }
      if (this.element.columns.length === 2) {
        columnsOptions.push({
          value: "invertedStacking",
          label: "Inverted stacking"
        });
      }
      return columnsOptions;
    },
  },
  watch: {
    element: {
      handler: function(newElement) {
        if (newElement.columns.length === 1 || newElement.columns.length > 2 && this.mainSetting === "invertedStacking") {
          this.mainSetting = "normal";
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.width-full {
  width: 100%;
}
</style>
