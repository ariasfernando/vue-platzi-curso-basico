<template>
  <div
    class="settings-container"
    :class="[
      customClass,
      {'clearfix' : !hasSettingHalf},
      {'is-setting-half' : hasSettingHalf},
      {[`level-${level}-container`] : level}
    ]">
    <template v-if="hasSettingRight">
      <label
        v-if="!noLabel"
        :class="{[`level-${level}`] : level}"
        class="half"
        :title="title">
        {{ label }}
      </label>
      <div class="half-setting padding-top">
        <slot name="setting-right" />
      </div>
    </template>

    <template v-if="hasSettingSideBySide">
      <div class="half-setting half-setting--left">
        <label
          v-if="!noLabel"
          :class="{[`level-${level}`] : level}"
          :title="titleLeft">
          {{ labelLeft }}
        </label>
        <slot name="setting-half-left" />
      </div>
      <div class="half-setting half-setting--right">
        <label
          v-if="!noLabel"
          :class="{[`level-${level}`] : level}"
          :title="titleRight">
          {{ labelRight }}
        </label>
        <slot name="setting-half-right" />
      </div>
    </template>

    <template v-if="hasSettingBottom">
      <label
        v-if="!noLabel"
        :class="{[`level-${level}`] : level}"
        :title="title">
        {{ label }}
      </label>
      <slot name="setting-bottom" />
    </template>

    <template v-if="hasSettingHalf">
      <label
        v-if="!noLabel"
        :class="{[`level-${level}`] : level}"
        :title="title">
        {{ label }}
      </label>
      <slot name="setting-half" />
    </template>
  </div>
</template>
<script>
export default {
  name: 'SettingsContainers',
  props: [
    'customClass',
    'label',
    'level',
    'label-right',
    'label-left',
    'title',
    'titleRight',
    'titleLeft',
    'noLabel',
  ],
  computed: {
    hasSettingRight() {
      return Boolean(this.$slots['setting-right']);
    },
    hasSettingSideBySide() {
      return (
        Boolean(this.$slots['setting-half-left']) &&
        Boolean(this.$slots['setting-half-right'])
      );
    },
    hasSettingBottom() {
      return Boolean(this.$slots['setting-bottom']);
    },
    hasSettingHalf() {
      return Boolean(this.$slots['setting-half']);
    },
  },
};
</script>
<style lang="scss" scoped>
.settings-container {
  margin-bottom: 6px;
  margin-left: 0;
  margin-right: 0;
  position: relative;
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  .half-setting /deep/ .el-switch {
    margin-top: 4px;
  }
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
.is-setting-half {
  display: table;
  float: left;
  width: 50%;
  margin-bottom: 0;
  &:nth-child(2n + 1) {
    padding-right: 8px;
  }
  &:nth-child(2n + 2) {
    padding-left: 8px;
  }
}
.clearfix {
  clear: both;
}
.is-danger /deep/ input {
  border-color: #ce5f5f;
}
</style>
