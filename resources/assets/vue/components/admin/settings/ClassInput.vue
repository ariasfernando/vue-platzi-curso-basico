<template>
  <settings-container label="Class Input">
    <template slot="setting-bottom">
      <el-select
      class="width-full class-input"
      multiple
      filterable
      allow-create
      default-first-option
      :placeholder="label"
      :value="classes"
      v-model="classes"
      size="mini"
      >
        <el-option
          v-for="item in classes"
          :key="item"
          :label="item"
          :value="item"
          >
        </el-option>
      </el-select>
    </template>
  </settings-container>
</template>
<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "ClassInput",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  computed: {
    classes: {
      get() {
        if (!this.mainSetting) {
          return [];
        }
        return this.mainSetting.split(" ");
      },
      set(values) {

        let newClasses = [];
        for (let n = 0; n < values.length; n++) {
          if (values[n].match(/[^a-z0-9-_]+/i)) {
            this.$root.$toast('Only alphanumeric characters, hyphens and underscores are allowed.', {className: 'et-error'});
          } else {
            newClasses.push(values[n].toLowerCase());
          }
        }

        this.mainSetting = newClasses.join(" ");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
.class-input{
  .el-input__inner{
    border-radius: 2px;

    &:focus{
      border: 1px solid #78dcd6;
    }
  }
}
</style>