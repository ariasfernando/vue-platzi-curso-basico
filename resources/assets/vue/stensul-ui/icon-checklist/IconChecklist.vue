<template>
  <div class="stui-icon-hecklist">
    <el-button
      v-for="(option, key) in list"
      :key="option.enable+key"
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
      type: [String, Object, Boolean],
      default: '',
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleOption(option) {
      let newValue = '';
      if (this.multiselect) {
        newValue = (typeof this.value === 'object') ? _.cloneDeep(this.value) : {};
        newValue[option.enable] = !newValue[option.enable];
      } else {
        newValue = this.value === option.enable ? option.disabled : option.enable;
      }

      this.$emit('input', newValue);
      this.$emit('change', newValue);
    },
    isActive(option) {
      if (typeof this.value === 'object') {
        return this.value[option.enable];
      }
      return option.enable === this.value;
    },
  },
};
</script>
<style lang='scss' scoped>
.stui-icon-hecklist {
  text-align: left;
  /deep/ {
    .el-button:focus,
    .el-button:hover {
      color: inherit;
      border-color: inherit;
      background-color: inherit;
    }
    .el-button.active {
      color: #ffffff;
      border-color: rgb(120, 220, 214);
      background-color: rgb(120, 220, 214);
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
