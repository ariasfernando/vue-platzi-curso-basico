<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="half-style-setting">
        <label :for="'fontSize'">Font Size</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="fontSize"
          :value="fontSize"
          :class="{'clearfix': true, 'is-danger': errors.has('fontSize') }"
          :min="5"
          :max="50"
        ></el-input-number>
        <span class='icon-block-line-height' @click="toggleLineHeight">
          <i v-if="isBlockLineHeight" class="fa fa-lock"></i>
          <i v-else class="fa fa-unlock"></i>
          </span>
    </div>
    <div class="half-style-setting">
        <label :for="'lineHeight'">Line Height</label>
        <el-input-number
          size="mini" 
          v-validate="'required'"
          v-model="lineHeight"
          :value="lineHeight"
          :class="{'clearfix': true, 'is-danger': errors.has('lineHeight') }"
          :min="6"
          :max="60"
          :disabled="isBlockLineHeight"
        ></el-input-number>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from '../mixins/SettingMixin.js';

export default {
  name: "font-style",
  props: ["setting"],
  mixins: [ SettingMixin ],
  computed: {
    isBlockLineHeight: {
      get() {
        return this.component.styleOptions["isBlockLineHeight"];
      },
      set(newValue) {
        this.$emit('style-option-setting-updated', { name: "isBlockLineHeight", value: newValue });
      }
    },
    fontSize: {
      get() {
        return _.parseInt(this.component.style["fontSize"]);
      },
      set(newValue) {
        this.$emit('style-setting-updated', { name: "fontSize", value: newValue + "px" });
        
        if (this.isBlockLineHeight) {
          this.lineHeight = this.calculateLineHeight(newValue);
        }
      }
    },
    lineHeight: {
      get() {
        return _.parseInt(this.component.style["lineHeight"]);
      },
      set(newValue) {
        this.$emit('style-setting-updated', { name: "lineHeight", value: newValue + "px" });
      }
    }
  },
  methods: {
    calculateLineHeight(fontSize) {
      return Math.round(fontSize * 1.2);
    },
    toggleLineHeight() {
      this.isBlockLineHeight = !this.isBlockLineHeight;
      this.lineHeight = this.calculateLineHeight(this.fontSize);
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
  width: 30px;
  text-align: center;
  padding-top: 4px;
  z-index: 2;
  bottom: 0px;
  cursor: pointer;
  i {
    color: #666666;
  }
}
.el-input-number {
    width: 105px;
}
</style>
