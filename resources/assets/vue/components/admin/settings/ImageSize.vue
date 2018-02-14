<template>
  <div class="form-group" :class="'field-' + setting">
    <div class="col-xs-6" v-for="imageSizeSetting in imageSizeSettings" :key="imageSizeSetting.name">
        <label class="clearfix control-label" :for="imageSizeSetting.name">{{imageSizeSetting.label}}</label>
        <el-input-number
          v-if="imageSizeSetting.name === 'width' || !isBlockHeight" 
          size="mini" 
          v-validate="'required'"
          v-model="imageSizeSetting.value"
          :class="{'clearfix': true,'input-number-size': true, 'is-danger': errors.has(imageSizeSetting.name) }"
          :name="imageSizeSetting.name"
          @change="(newValue)=>changeValue(newValue, imageSizeSetting.name)"
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
            @change="(newValue)=>changeValue(newValue,imageSizeSetting.name)"
          ></el-input>
        <el-button
          v-if="!(imageSizeSetting.name === 'height' && isBlockHeight)"
          slot="append"
          :class="{'icon-disable': imageSizeSetting.name === 'height'}"
          :disabled="imageSizeSetting.name === 'height'"
          @click="onTogglePxWidth"
        >{{pixelOrPercentage(imageSizeSetting.name)}}</el-button>
        <span class='height-icon-auto' v-if="imageSizeSetting.name === 'width'" @click="onToggleBlockheight">
          <i v-if="isBlockHeight" class="fa fa-arrow-right"></i>
          <i v-else class="fa fa-minus"></i>
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageSize",
  props: ["setting"],
  data() {
    return {
      isBlockHeight: true,
      isPxWidth: true,
      imageSizeSettings: [],
      min: 10
    };
  },
  mounted() {
    this.isBlockHeight = this.getValue("isBlockHeight");
    this.isPxWidth = this.getValue("isPxWidth");
    this.imageSizeSettings = [
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
  },
  computed: {
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

    changeValue(val, property) {
      isNaN(val) || val < this.min ? this.min : val;
      if (property === "width" && !this.isPxWidth) {
        // is width+%
        this.saveAttribute(val + "%", property);
      } else {
        // is width+px or height+px
        this.saveAttribute(val, property);
      }
    },
    pixelOrPercentage(property) {
      return property === "width" && !this.isPxWidth ? "%" : "px";
    },
    maxValue(property) {
      return property === "width" && !this.getValue("isPxWidth")
        ? 100
        : undefined;
    },
    onTogglePxWidth() {
      let width = this.imageSizeSettings[0].value;
      // set isPxWidth
      let isPxWidth = !this.getValue("isPxWidth");
      if (isPxWidth) {
        // save width + px
        this.saveAttribute(width + "px", "width");
      } else {
        width = Math.min(100, width);
        this.imageSizeSettings[0].value = width;
        this.saveAttribute(width + "%", "width");
      }
      // save and update isPxWidth
      this.saveStyleOption(isPxWidth, "isPxWidth");
      this.isPxWidth = isPxWidth;
    },
    onToggleBlockheight() {
      // set isBlock
      let isBlock = !this.getValue("isBlockHeight");
      if (isBlock) {
        // save and update height
        let height = "auto";
        this.saveAttribute(height, "height");
        this.imageSizeSettings[1].value = height;
      } else {
        let height = 100;
        this.saveAttribute(height + "px", "height");
        this.imageSizeSettings[1].value = height;
      }
      // save and update isBlock
      this.saveStyleOption(isBlock, "isBlockHeight");
      this.isBlockHeight = isBlock;
    },

    getValue(name) {
      let value;
      if (name === "isBlockHeight" || name === "isPxWidth") {
        value = this.component.styleOptions[name];
      } else {
        value = this.component.attribute[name].replace("px", "");
        value = value.replace("%", "");
      }
      return value;
    },

    saveStyleOption(value, property) {
      this.$store.commit("module/saveComponentStyleOption", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: property,
        value: value
      });
    },

    saveAttribute(value, property) {
      this.$store.commit("module/saveComponentAttribute", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        attribute: property,
        attributeValue: value
      });
    }
  }
};
</script>
<style lang="less">
.height-auto input {
  text-align: center;
}
.height-icon-auto {
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
  right: 22px;
  padding: 6px;
  &:active {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}
</style>
