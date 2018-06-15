<template>
    <div class="clearfix settings-container" :class="customClass || ''">
      <template v-if="hasSettingRight">
        <label class="half" :title="title">{{label}}</label>
        <div class="half-setting padding-top">
            <slot name="setting-right"></slot>
        </div>
      </template>

      <template v-if="hasSettingSideBySide">
        <div class="half-setting">
          <label :title="titleLeft">{{labelLeft}}</label>
          <slot name="setting-half-left"></slot>
        </div>
        <div class="half-setting">
          <label :title="titleRight">{{labelRight}}</label>
          <slot name="setting-half-right"></slot>
        </div>
      </template>
    
      <template v-if="hasSettingBottom">
        <label :title="title">{{label}}</label>
        <slot name="setting-bottom"></slot>
      </template>
    
    </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "SettingsContainers",
  props: [
    "customClass",
    "label",
    "label-right",
    "label-left",
    "title",
    "titleRight",
    "titleLeft"
  ],
  computed: {
    hasSettingRight() {
      return Boolean(this.$slots["setting-right"]);
    },
    hasSettingSideBySide() {
      return (
        Boolean(this.$slots["setting-half-left"]) &&
        Boolean(this.$slots["setting-half-right"])
      );
    },
    hasSettingBottom() {
      return Boolean(this.$slots["setting-bottom"]);
    }
  }
};
</script>
<style lang="less" scoped>
.settings-container {
  margin-bottom: 6px;
  margin-left: 0;
  margin-right: 0;
}
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
span.is-danger {
  font-size: 11px;
  font-weight: 300;
  color: #ce5f5f;
}
</style>