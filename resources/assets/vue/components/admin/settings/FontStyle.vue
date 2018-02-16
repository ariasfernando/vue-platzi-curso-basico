<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6" v-for="fontStyleSetting in fontStyleSettings" :key="fontStyleSetting.name">
        <label class="clearfix control-label" :for="fontStyleSetting.name">{{fontStyleSetting.label}}</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="fontStyleSetting.value"
          :class="{'clearfix': true, 'is-danger': errors.has(fontStyleSetting.name) }"
          @change="(val)=>changeValue(val,fontStyleSetting)"
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
      return this.getValue("isBlockLineHeight");
    },
    fontStyleSettings() {
      return [
        {
          label: "Font size",
          name: "fontSize",
          value: this.getValue("fontSize"),
          min: 5,
          max: 50
        },
        {
          label: "Line Height",
          name: "lineHeight",
          value: this.getValue("isBlockLineHeight")
            ? this.calculeLineHeight()
            : this.getValue("lineHeight"),
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
        let lineHeightCalculated = this.calculeLineHeight();
        this.fontStyleSettings[1].value = lineHeightCalculated;
        this.saveStyle(lineHeightCalculated, "lineHeight");
      }
      this.saveStyle(val, setting.name);
    },

    calculeLineHeight() {
      return Math.round(this.getValue("fontSize") * 1.2);
    },

    toggleLineHeight() {
      // set date
      let isBlock = !this.getValue("isBlockLineHeight");
      let lineHeight = this.calculeLineHeight();
      // save and update date
      this.saveStyleOption(isBlock, "isBlockLineHeight");
      this.saveStyle(lineHeight, "lineHeight");
    },

    getValue(name) {
      let value;
      if (name === "isBlockLineHeight") {
        value = this.component.styleOptions[name];
      } else {
        value = _.parseInt(this.component.style[name]);
      }
      return value;
    },

    saveStyleOption(val, name) {
      this.$store.commit("module/saveComponentStyleOption", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: name,
        value: val
      });
    },

    saveStyle(val, name) {
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
