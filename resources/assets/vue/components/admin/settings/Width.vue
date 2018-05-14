<template>
    <settings-container :label="label" custom-class="width-setting">
      <template slot="setting-right">
          <el-input-number
            size="mini" 
            v-validate="'required'"
            v-model="mainSettingNumeric"
            :min="minValueCalculated"
            :max="maxValueCalculated"
            class="padding-custom align-element"
            :controls="false"
          ></el-input-number>
        <el-button
          slot="append"
          class="button icon-disable"
          @click="onTogglePxWidth"
        >{{this.isPxWidth ? "px": "%"}}</el-button>
      </template>
    </settings-container>
</template>

<script>
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "width",
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
    };
  },
  mounted() {
    this.defineStyleOption();
  },
  computed: {
    isPxWidth: {
      get() {
        return this.element.styleOption["isPxWidth"];
      },
      set(value) {
        this.$emit("setting-updated", {
          subComponent: this.subComponent,
          link: "styleOption",
          name: "isPxWidth",
          value: value
        });
      }
    },
    mainSettingNumeric: {
      get() {
        return parseFloat(this.mainSetting);
      },
      set(value) {
        value = isNaN(value) || value < this.minValueCalculated ? this.minValueCalculated : value;
        value = this.isPxWidth ? `${value}` : `${value}%`;
        this.mainSetting = value;
      }
    },
    minValueCalculated() {
    return  this.minValue ? this.minValue : 1;
    },
    maxValueCalculated() {
      return this.isPxWidth ? undefined : 100;
    }
  },
  methods: {
    onTogglePxWidth() {
      let isPxWidth = !this.isPxWidth;
      let width = this.mainSettingNumeric;
      if (!isPxWidth) {
        width = Math.min(100, parseFloat(this.mainSettingNumeric));
      }
      width = isNaN(width) || width < this.minValueCalculated ? this.minValueCalculated : width;
      width = isPxWidth ? `${width}` : `${width}%`;
      this.isPxWidth = isPxWidth;
      this.mainSetting = width;
    },
    defineStyleOption() {
        // set styleOption to default if is undefined
        if (this.element.styleOption["isPxWidth"] === undefined) {
          this.isPxWidth = false;
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
<style lang="less" scoped>
.button input {
  text-align: center;
}
.input-number-size {
  padding-left: 0;
  padding-right: 21px;
}
.el-button.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #dcdfe6;
}
.el-button {
  position: absolute;
  right: 15px;
  padding: 6px;
  &:active {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
.el-input-number {
  width: 80px;
}
</style>
<style  lang="less">
.width-setting {
  input[type="text"] {
    text-align: center;
  }
  .el-input-number .el-input__inner {
    text-align: center;
    border-right: 0;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
}
</style>
