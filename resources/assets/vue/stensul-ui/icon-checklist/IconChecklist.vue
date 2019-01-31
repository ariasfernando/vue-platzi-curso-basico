<template>
  <div class="stui-icon-hecklist">
    <el-button
      v-for="(option, key) in list"
      :key="option.key+key"
      v-b-tooltip.hover
      :class="[option.icon , {'active': isActive(option)}]"
      :title="option.label"
      :data-tooltip="option.label"
      @click.prevent="toggleOption(option)" />
  </div>
</template>

<script>
export default {
  name: 'IconChecklist',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: [Object],
      required: true,
    },
  },
  methods: {
    toggleOption(option) {
      const value = _.cloneDeep(this.value);
      value[option.key] = !value[option.key];
      this.$emit('input', value);
      this.$emit('change', value);
    },
    isActive(option) {
      return this.value[option.key];
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../scss/stui.scss';

.stui-icon-hecklist {
  text-align: left;
  border-color: $stui-input-border-color;
  /deep/ {
    .el-button:focus,
    .el-button:hover {
      color: inherit;
      border-color: inherit;
      background-color: inherit;
    }
    .el-button.active {
      color: #ffffff;
      border-color: $stui-color-secondary;
      background-color: $stui-color-secondary;
    }
    .el-button {
      width: 26px;
      padding: 4px 4px;
      height: 26px;
      font-size: 13px;
    }
  }
}
</style>
