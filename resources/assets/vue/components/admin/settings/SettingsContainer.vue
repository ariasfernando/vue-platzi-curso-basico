<template>
    <div class="form-group settings-container" :class="customClassName">
        <label :class="labelClass">{{label}}</label>
        <div class="half-setting padding-top">
            <slot name="setting-left" ></slot>
            <slot ></slot>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "SettingsContainers",
  props: ["label", "customClass"],
  computed: {
    hasSettingLeftSlot() {
      return !!this.$slots["setting-left"];
    },
    customClassName() {
      return this.customClass || "";
    },
    labelClass() {
      return this.hasSettingLeftSlot ? "half" : "";
    }
  }
};
</script>
<style lang="less" scoped>
.half-setting {
    width: 50%;
    float: left;
    position: relative;
  & + .half-setting {
    padding-left: 15px;
  }
  &.padding-top {
    padding-top: 5px;
  }
  &.float-right {
    float: right;
  }
}
label {
  text-align: left;
  color: #666666;
  font-weight: 300;
  padding: 10px 0 5px;
  font-size: 12px;
  width: 100%;
  float: left;
  margin-bottom: 0;
  &.half {
    width: 50%;
  }
}
</style>
