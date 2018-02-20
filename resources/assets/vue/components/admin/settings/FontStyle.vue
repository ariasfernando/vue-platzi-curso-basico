<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6" v-for="fontStyleSetting in fontStyleSettings" :key="fontStyleSetting.name">
        <label class="clearfix control-label" :for="fontStyleSetting.name">{{fontStyleSetting.label}}</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="fontStyleSetting.value"
          :class="{'clearfix': true, 'is-danger': errors.has(fontStyleSetting.name) }"
          @change="(val)=>changeValue(val, fontStyleSetting)"
          :min="fontStyleSetting.min"
          :max="fontStyleSetting.max"
          :disabled="fontStyleSetting.name === 'lineHeight' ? isBlockLineHeight : false"
        ></el-input-number>
        <span class='icon-block-line-height' v-if="fontStyleSetting.name === 'fontSize'" @click="toggleLineHeight">
          <i v-if="isBlockLineHeight" class="fa fa-arrow-right"></i>
          <i v-else class="fa fa-minus"></i>
          </span>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "font-style",
  props: ["setting"],
  computed: {
    isBlockLineHeight() {
      return this.getStyleOptionValue("isBlockLineHeight");
    },
    fontStyleSettings() {
      return [
        {
          label: "Font size",
          name: "fontSize",
          value: this.getStyleValue("fontSize"),
          min: 5,
          max: 50
        },
        {
          label: "Line Height",
          name: "lineHeight",
          value: this.getStyleOptionValue("isBlockLineHeight")
            ? this.calculateLineHeight()
            : this.getStyleValue("lineHeight"),
          min: 6,
          max: 60
        }
      ];
    },

    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent.columnId].components[
          this.currentComponent.componentId
        ];
      return component;
    }
  },

  methods: {
    changeValue(val, setting) {
      if (setting.name === "fontSize" && this.isBlockLineHeight) {
        // if isBlockLineHeight then update lineHeight
        let lineHeightCalculated = this.calculateLineHeight();
        this.fontStyleSettings[1].value = lineHeightCalculated;
        this.saveStyleValue(lineHeightCalculated, "lineHeight");
      }
      this.saveStyleValue(val, setting.name);
    },

    calculateLineHeight() {
      return Math.round(this.getStyleValue("fontSize") * 1.2);
    },

    toggleLineHeight() {
      // set date
      let isBlock = !this.getStyleOptionValue("isBlockLineHeight");
      let lineHeight = this.calculateLineHeight();
      // save and update date
      this.saveStyleOptionValue(isBlock, "isBlockLineHeight");
      this.saveStyleValue(lineHeight, "lineHeight");
    },

    getStyleValue(name) {
      return _.parseInt(this.component.style[name]);
    },

    getStyleOptionValue(name) {
      return this.component.styleOptions[name];
    },

    saveStyleOptionValue(val, name) {
      this.$store.commit("module/saveComponentStyleOption", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val
      });
    },

    saveStyleValue(val, name) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val + "px"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.icon-block-line-height {
  position: absolute;
  right: -15px;
  margin-top: 0px;
  padding: 0px;
  height: 28px;
  width: 36px;
  text-align: center;
  padding-top: 4px;
  z-index: 2;
  cursor: pointer;
  i {
    color: #666666;
  }
}
</style>
