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
  data() {
    return {
      columnsStacking: '',
    };
  },

  computed: {
    columnsOptions() {
      return [
          {
            value: "normal",
            label: "Normal"
          },
          {
            value: "columnsFixed",
            label: "Columns fixed"
          },
          {
            value: "invertedStacking",
            label: "Inverted stacking"
          }];
    },
    mounted() {
      columnsStacking = this.mainSetting
    },
  },
  watch: {
    element: {
      handler: function(newElement) {
        if (newElement.columns.length === 1) {
          this.mainSetting = "normal";
        }
      },
      deep: true
    },
    mainSetting: function(newMainSetting) {
        if( newMainSetting !== this.columnsStacking && (newMainSetting === "invertedStacking" || this.columnsStacking  === "invertedStacking")) {
        // If the new value or the old value is invertedStacking: the columns will reverse
          const columnsClone = _.clone(this.element.columns)
          this.$emit("setting-updated", {
            name: 'columns',
            value: columnsClone.reverse()
          });
        }
        this.columnsStacking = newMainSetting;
    }
  }
};
</script>
<style lang="scss" scoped>
.width-full {
  width: 100%;
}
</style>
