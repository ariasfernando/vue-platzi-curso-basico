<template>
    <div class="form-group settings-container" :class="customClass || ''">

      <template v-if="hasSettingRight">
        <label class="half">{{label}}</label>
        <div class="half-setting padding-top">
            <slot name="setting-right"></slot>
        </div>
      </template>

      <template v-if="hasSettingSideBySide">
        <div class="half-setting">
          <label>{{labelLeft}}</label>
          <slot name="setting-half-left"></slot>
        </div>
        <div class="half-setting">
          <label>{{labelRight}}</label>
          <slot name="setting-half-right"></slot>
        </div>
      </template>
    
    </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "SettingsContainers",
  props: ["customClass", "label", "label-right", "label-left"],
  computed: {
    hasSettingRight() {
      return !!this.$slots["setting-right"];
    },
    hasSettingSideBySide() {
      return !!this.$slots["setting-half-left"] && !!this.$slots["setting-half-right"];
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
