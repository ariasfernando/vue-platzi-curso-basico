<template>
    <div class="settings-container" :class="[customClass,{'clearfix' : !hasSettingHalf}, {[`level-${level}-container`] : level}]">
      <template v-if="hasSettingRight">
        <label :class="{[`level-${level}`] : level}" class="half" :title="title">{{label}}</label>
        <div class="half-setting padding-top">
            <slot name="setting-right"></slot>
        </div>
      </template>

      <template v-if="hasSettingSideBySide">
        <div class="half-setting">
          <label :class="{[`level-${level}`] : level}" :title="titleLeft">{{labelLeft}}</label>
          <slot name="setting-half-left"></slot>
        </div>
        <div class="half-setting">
          <label :class="{[`level-${level}`] : level}" :title="titleRight">{{labelRight}}</label>
          <slot name="setting-half-right"></slot>
        </div>
      </template>
    
      <template v-if="hasSettingBottom">
        <label :class="{[`level-${level}`] : level}" :title="title">{{label}}</label>
        <slot name="setting-bottom"></slot>
      </template>

      <template v-if="hasSettingHalf">
        <div class="half-setting">
          <label :class="{[`level-${level}`] : level}" :title="title">{{label}}</label>
          <slot name="setting-half"></slot>
        </div>
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
    "level",
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
    },
    hasSettingHalf() {
      return Boolean(this.$slots["setting-half"]);
    }
  }
};
</script>
<style lang="scss" scoped>
.settings-container {
  margin-bottom: 6px;
  margin-left: 0;
  margin-right: 0;
  position: relative;
}
.half-setting {
  width: 50%;
  float: left;
  text-align: right;
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
.level-first-container {
  margin-bottom: 10px;
  label.level-first {
    font-weight: bold;
    border-bottom: 1px solid #ddd !important;
  }
  .half-setting {
    padding-left: 10px;
  }
}
.is-danger /deep/ input{
  border-color: #ce5f5f;
}
</style>