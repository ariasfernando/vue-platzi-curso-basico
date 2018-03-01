<template>
  <div class="form-group" :class="'field-' + setting">
    <label>Font Family</label>
    <el-select
    class="width-full"
    multiple
    :placeholder="label"
    :value="fontFamily"
    v-model="fontFamily"
    size="mini"
    >
      <el-option
        v-for="item in options()"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "FontFamily",
  props: ["setting", "element", "link", "name", "label"],
  mixins: [ SettingMixin ],
  components: {
  },
  data() {
    return {
      options() {
        const options = [];
        _.each(this.$_app.config.fonts, group => {
          _.each(group, font => {
            options.push({
              value: font,
              label: font
            });
          });
        });

        return options;
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
