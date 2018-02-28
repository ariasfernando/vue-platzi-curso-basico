<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="half-style-setting" v-for="imageSizeSetting in imageSizeSettings" :key="imageSizeSetting.name">
        <label :for="imageSizeSetting.name">{{imageSizeSetting.label}}</label>
        <div>
          <el-input-number
            v-if="imageSizeSetting.name === 'width' || !isBlockHeight" 
            class="half-style-setting padding-custom align-element"
            size="mini" 
            v-validate="'required'"
            v-model="imageSizeSetting.value"
            :name="imageSizeSetting.name"
            @change="(val)=>changeValue(val, imageSizeSetting.name)"
            :max="maxValue(imageSizeSetting.name)"
            :min="min"
            :disabled="imageSizeSetting.name === 'height' ? isBlockHeight : false"
            :controls="false"
          ></el-input-number>
            <el-input
              v-else
              size="mini" 
              v-model="imageSizeSetting.value"
              :class="{'clearfix': true, 'height-auto': true, 'is-danger': errors.has(imageSizeSetting.name) }"
              :name="imageSizeSetting.name"
              placeholder="auto"
              disabled="disabled"
              @change="(val)=>changeValue(val,imageSizeSetting.name)"
            ></el-input>
          <el-button
            v-if="!(imageSizeSetting.name === 'height' && isBlockHeight)"
            slot="append"
            class="button"
            :class="{'icon-disable': imageSizeSetting.name === 'height'}"
            :disabled="imageSizeSetting.name === 'height'"
            @click="onTogglePxWidth"
          >{{getUnit(imageSizeSetting.name)}}</el-button>
          <span class='height-icon-auto' v-if="imageSizeSetting.name === 'width'" @click="onToggleBlockheight">
            <i v-if="isBlockHeight" class="fa fa-fa-lock"></i>
            <i v-else class="fa fa-unlock"></i>
          </span>
        </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import SettingMixin from "../mixins/SettingMixin.js";

export default {
  name: "ImageSize",
  props: ["setting", "element"],
  mixins: [ SettingMixin ],
  data() {
    return {
      min: 10
    };
  },
  computed: {
    isBlockHeight() {
      return this.element.styleOptions["isBlockHeight"];
    },
    isPxWidth() {
      return this.element.styleOptions["isPxWidth"];
    },
    imageSizeSettings() {
      return [
        {
          label: "Width",
          name: "width",
          value: this.getValue("width")
        },
        {
          label: "Height",
          name: "height",
          value: this.getValue("height"),
          max: undefined
        }
      ];
    }
  },
  methods: {
    changeValue(val, property) {
      val = (isNaN(val) || val < this.min) ? this.min : val;
      if (property === "width" && !this.isPxWidth) {
        // is width+%
        this.saveAttribute(`${val}%`, property);
      } else {
        // is width or height
        this.saveAttribute(`${val}`, property);
      }
    },
    getUnit(property) {
      return property === "width" && !this.isPxWidth ? "%" : "px";
    },
    maxValue(property) {
      return property === "width" && !this.isPxWidth
        ? 100
        : undefined;
    },
    onTogglePxWidth() {
      // set isPxWidth
      let isPxWidth = !this.isPxWidth;
      // set width
      let width = this.imageSizeSettings[0].value;
      if (!isPxWidth) {
        width = Math.min(100, width);
        width = width + "%";
      }
      // save
      this.saveStyleOption(isPxWidth, "isPxWidth");
      this.saveAttribute(`${width}`, "width");
    },
    onToggleBlockheight() {
      // set isBlock
      let isBlock = !this.isBlockHeight;
      if (isBlock) {
        // save and update height
        let height = "auto";
        this.saveAttribute(height, "height");
      } else {
        let height = 100;
        this.saveAttribute(height, "height");
      }
      // save and update isBlock
      this.saveStyleOption(isBlock, "isBlockHeight");
    },
    getValue(name) {
      return this.element.attribute[name] === "auto"
                ? "auto"
                : _.parseInt(this.element.attribute[name]);
    },

    saveStyleOption(newValue, styleOptionName) {
      this.$emit("style-option-setting-updated", { name: styleOptionName, value: newValue });
    },

    saveAttribute(newValue, attributeName) {
      this.$emit("attribute-setting-updated", { name: attributeName, value: newValue });
    }
  }
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
button.el-button {
  position: absolute;
  right: 0;
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
</style>
<style>
.field-image-size input[type="text"]{
  text-align: center;
}
</style>
