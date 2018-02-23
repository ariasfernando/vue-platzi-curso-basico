<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-12 control-label">Font Family</label>
    <div class="col-sm-12">
        <el-select
        class="width-full"
        multiple
        placeholder="Font Family"
        v-model="fontFamilyData"
        @change="saveValue"
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
  </div>
</template>

<script>
import _ from "lodash";
import clone from "clone";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "FontFamily",
  props: ["setting"],
  mixins: [ SettingMixin ],
  components: {
  },
  data() {
    return {
      name: "fontFamily",
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
      },
      fontFamilyData: this.fontFamily
    };
  },
  mounted() {
    this.fontFamilyData = this.fontFamily;
  },
  computed: {
    fontFamily() {
      const component = this.module.structure
        .columns[this.currentComponent.columnId]
        .components[this.currentComponent.componentId];

      if (!component.style.fontFamily) {
        return [];
      }

      return component.style.fontFamily.split(", ");
    }
  },
  watch: {
    fontFamily(value) {
      this.fontFamilyData = value;
    }
  },
  methods: {
    saveValue(newValue) {
      this.$emit("style-setting-updated", { name: this.name, value: newValue.join(", ") });
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
