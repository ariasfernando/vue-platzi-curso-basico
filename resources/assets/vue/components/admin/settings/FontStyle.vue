<template>
  <settings-container label-left="Font Size" label-right="Line Height">
    <template slot="setting-half-left">
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
    </template>
    <template slot="setting-half-right">
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
    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "font-style",
  mixins: [ SettingMixin ],
  components: { SettingsContainer },
  mounted() {
    this.defineStyleOption();
  },
  computed: {
    isBlockLineHeight: {
      get() {
        return this.element.styleOption["isBlockLineHeight"];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'styleOption',
          name: "isBlockLineHeight",
          value: newValue
        });
      }
    },
    fontSize: {
      get() {
        return _.parseInt(this.element.style["fontSize"]);
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: "fontSize",
          value: newValue + "px"
        });
        
        if (this.isBlockLineHeight) {
          this.lineHeight = this.calculateLineHeight(newValue);
        }
      }
    },
    lineHeight: {
      get() {
        return _.parseInt(this.element.style["lineHeight"]);
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: "lineHeight",
          value: newValue + "px"
        });
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
    },
    defineStyleOption(){
      // set styleOption to default if is undefined
      if (this.element.styleOption["isBlockLineHeight"] === undefined) {
        this.isCustomFontWeight = false;
      }
    }
  },
  watch: {
    element: {
      handler: function(){
        this.defineStyleOption();
        },
      deep: true
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-block-line-height {
  position: absolute;
  margin-top: 0;
  padding: 0;
  height: 26px;
  width: 30px;
  text-align: center;
  padding-top: 4px;
  z-index: 2;
  bottom: 0;
  cursor: pointer;

  i {
    color: #666666;
  }
}
.el-input-number {
  width: 105px;
}
.settings-container /deep/ .half-setting:first-of-type{
  text-align: left;
}
.el-input-number /deep/ .el-input-number__decrease{
  border-radius: 2px 0px 0px 2px;
  background: #f8f8f8;
}
.el-input-number /deep/ .el-input-number__increase{
  border-radius: 0px 2px 2px 0px;
  background: #f8f8f8;
} 
.el-input-number /deep/ .el-input_inner{
  &:focus{
    border: 1px solid #78dcd6;
  }
}
.el-input-number /deep/ .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), 
.el-input-number /deep/ .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
  border: 1px solid #78dcd6;
}
</style>
