<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6" v-for="fontStyleSetting in fontStyleSettings" :key="fontStyleSetting.name">
        <label class="clearfix control-label" :for="fontStyleSetting.name">{{fontStyleSetting.label}}</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="fontStyleSetting.value"
          :class="{'input clearfix': true, 'is-danger': errors.has(fontStyleSetting.name) }"
          :name="fontStyleSetting.name"
          :ref="fontStyleSetting.name"
          @change="(newValue)=>clangeValue(newValue,fontStyleSetting.name)"
          :min="fontStyleSetting.min"
          :max="fontStyleSetting.max"
          :disabled="fontStyleSetting.name === 'lineHeight' ? isBlockLineHeight : false"
        ></el-input-number>
        <span class='icon-block-line-height' v-if="fontStyleSetting.name === 'fontSize'" @click="onBlockLineHeight">
          <i v-if="isBlockLineHeight" class="fa fa-arrow-right"></i>
          <i v-else class="fa fa-minus"></i>
          </span>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "FontStyle",
  props: ["setting"],
  data() {
    return {
      isBlockLineHeight: true,
      fontStyleSettings: []
    };
  },
  mounted() {
    this.isBlockLineHeight = this.getValue("isBlockLineHeight");
    this.fontStyleSettings = [
      {
        label: "Line size",
        name: "fontSize",
        value: this.getValue("fontSize"),
        min: 5,
        max: 50
      },
      {
        label: "Line Height",
        name: "lineHeight",
        value: this.getValue("isBlockLineHeight")
          ? calculeLineHeight()
          : this.getValue("lineHeight"),
        min: 6,
        max: 60
      }
    ];
  },
  methods: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },

    clangeValue(newValue, property) {
      if (property === "fontSize" && this.isBlockLineHeight) {
        // if isBlockLineHeight then update lineHeight
        let lineHeightCalculated = this.calculeLineHeight();
        this.fontStyleSettings[1].value = lineHeightCalculated;
        this.saveStyle(lineHeightCalculated, "lineHeight");
      }
      this.saveStyle(newValue, property);
    },

    calculeLineHeight() {
      return Math.round(this.getValue("fontSize") * 1.2);
    },

    onBlockLineHeight() {
      // set date
      let isBlock = !this.getValue("isBlockLineHeight");
      let lineHeight = this.calculeLineHeight();
      // save and update date
      this.saveStyleOption(isBlock, "isBlockLineHeight");
      this.saveStyle(lineHeight, "lineHeight");
      this.isBlockLineHeight = isBlock;
      this.fontStyleSettings[1].value = lineHeight;
    },

    getValue(name) {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent().columnId].components[
          this.currentComponent().componentId
        ];
      let value;
      if (name === "isBlockLineHeight") {
        value = component.styleOptions[name];
      } else {
        value = component.style[name].replace("px", "");
      }
      return value;
    },

    saveStyleOption(newValue, property) {
      this.$store.commit("module/saveComponentStyleOption", {
        columnId: this.currentComponent().columnId,
        componentId: this.currentComponent().componentId,
        property: property,
        value: newValue
      });
    },

    saveStyle(newValue, property) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent().columnId,
        componentId: this.currentComponent().componentId,
        property: property,
        value: newValue + "px"
      });
    }
  }
};
</script>
<style lang="less">
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
