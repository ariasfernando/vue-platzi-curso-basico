<template>
  <settings-container class="field-font-family" label="Font Family">
    <template slot="setting-bottom">
      <el-select
      class="width-full"
      multiple
      :placeholder="label"
      :value="fontFamily"
      v-model="fontFamily"
      size="mini"
      >
        <el-option
          v-for="item in fontsOptions()"
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
  name: "FontFamily",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      fontsOptions() {
        const fontsOptions = [];
        _.each(this.$_app.config.fonts, (group, index) => {
          group.map(font => {
            if (index === 'custom') {
                fontsOptions.push({
                value: font.name,
                label: font.name
              });
            } else {
                fontsOptions.push({
                value: font,
                label: font
              });
            }
          });
        });

        return fontsOptions;
      }
    };
  },
  computed: {
    fontFamily: {
      get() {
        if (!this.mainSetting) {
          return [];
        }

        return this.mainSetting.split(", ");
      },
      set(newValue) {
        this.mainSetting = newValue.join(", ");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>

<style lang="less">
.field-font-family {
  span > span.el-tag.el-tag--info {
    counter-increment: step-counter;
    & span::before {
      content: counter(step-counter);
      margin-right: 5px;
    }
  }
}
</style>
