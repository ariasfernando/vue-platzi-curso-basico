<template>
  <settings-container label-right="Height" label-left="Width" custom-class="field-image-size">
    <template slot="setting-half-left">

      <el-input-number
        class="padding-custom align-element"
        size="mini" 
        v-model="width"
        :max="maxValueWidth"
        :min="min"
        :controls="false"
      ></el-input-number>
      <el-button
        slot="append"
        class="button icon-disable"
        @click="onTogglePxWidth"
      >{{this.isPxWidth ? "px": "%"}}</el-button>

      <span class='height-icon-auto' @click="onToggleBlockheight">
        <i v-if="isBlockHeight" class="fa fa-lock"></i>
        <i v-else class="fa fa-unlock"></i>
      </span>

    </template>
    <template slot="setting-half-right">

      <el-input-number
        v-if="!isBlockHeight"
        class="padding-custom align-element"
        size="mini" 
        v-model="height"
        :min="min"
        :controls="false"
      ></el-input-number>
      <el-button
        v-if="!isBlockHeight"
        slot="append"
        class="button icon-disable icon-height"
        :disabled="true"
      >px</el-button>
      <el-input
        v-else
        size="mini" 
        v-model="height"
        class="clearfix"
        disabled="disabled"
      ></el-input>

    </template>
  </settings-container>
</template>
<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";
import SettingsContainer from "../../common/settings/containers/SettingsContainer.vue";

export default {
  name: "ImageSize",
  props: ["setting", "element", "subComponent","minValue"],
  mixins: [SettingMixin],
  components: { SettingsContainer },
  data() {
    return {
      min: this.minValue ? this.minValue : 10
    };
  },
  computed: {
    isBlockHeight: {
      get(){
        return this.element.styleOptions["isBlockHeight"];
      },
      set(value){
        this.$emit("style-option-setting-updated", {
          subComponent: this.subComponent,
          name: 'isBlockHeight',
          value: value
        });
      }
    },
    isPxWidth: {
      get(){
        return this.element.styleOptions["isPxWidth"];
      },
      set(value){
        this.$emit("style-option-setting-updated", {
          subComponent: this.subComponent,
          name: 'isPxWidth',
          value: value
        });
      }
    },
    width: {
      get() {
        return _.parseInt(this.element.attribute['width']);
      },
      set(value){
        value = isNaN(value) || value < this.min ? this.min : value;
        value = this.isPxWidth ? `${value}` :`${value}%`;
        this.$emit("attribute-setting-updated", {
          subComponent: this.subComponent,
          name: 'width',
          value: value
        });
      }
    },
    height: {
      get() {
          return this.element.attribute['height'] === "auto" ? "auto" : _.parseInt(this.element.attribute['height']);        
      },
      set(value){
        value = (isNaN(value) || value < this.min) && value !== "auto" ? this.min : value;
        value = `${value}`;
        this.$emit("attribute-setting-updated", {
          subComponent: this.subComponent,
          name: 'height',
          value: value
        });
      }
    },
    maxValueWidth() {
      return this.isPxWidth ? undefined : 100;
    },
  },
  methods: {
    onTogglePxWidth() {
      let isPxWidth = !this.isPxWidth;
      let width;
      if (!isPxWidth) {
        width = Math.min(100, this.width);
      }

      this.isPxWidth = isPxWidth;
      this.width = width;
    },
    onToggleBlockheight() {
      let isBlockHeight = !this.isBlockHeight;
      if (isBlockHeight) {
        this.height = "auto";
      } else {
        this.height = '100';
      }
      this.isBlockHeight = isBlockHeight;
    },
  },
};
</script>
<style lang="less" scoped>
.button input {
  text-align: center;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: #606266;
  cursor: inherit;
  border: 1px solid #dcdfe6;
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
#field-image-size.form-group.field-image-size {
  .padding-custom {
    padding: 5px 0;
  }
  .el-input-number--mini {
    width: 80px;
    margin-right: 25px;
    float: right;
  }
  .field-image-size {
    padding-right: 15px;
  }
  .half-style-setting {
    width: calc(~"50% - 15px");
    margin-right: 15px;
  }
  .half-style-setting:nth-child(2n + 2) {
    margin-left: 10px;
    margin-right: 0;
    padding-left: 0;
  }
}
.height-icon-auto {
  position: absolute;
  right: -15px;
  margin-top: 0;
  padding: 0;
  height: 28px;
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
.icon-height {
  right: 0;
}
.el-input-number {
  width: 80px;
}
</style>
<style  lang="less">
.field-image-size {
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
