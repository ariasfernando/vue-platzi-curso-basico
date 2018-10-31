<template>
  <settings-container class="input-font-weight" label="Font Weight">
    <template slot="setting-right">
      <el-select
        v-model="fontWeight"
        class="custom-col"
        size="mini"
        placeholder="Font Weight">
        <el-option
          v-for="item in weightOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
  </settings-container>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'FontWeight',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      linkName: 'fontWeight',
      weightOptions: [],
    };
  },
  computed: {
    fontWeight: {
      get() {
        return this.element.style[this.linkName];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: this.linkName,
          value: newValue,
        });
      },
    },
  },
  mounted() {
    function getweightOptions() {
      const weightOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Bold' },
      ];
      let val = 100;
      for (; val < 901;) {
        weightOptions.push({ value: val, label: val });
        val += 100;
      }
      return weightOptions;
    }
    this.weightOptions = getweightOptions();
  },
};
</script>
<style lang="scss" scoped>
.el-select {
  padding: 0;
}
.custom-col {
  width: 100%;
  float: left;
  display: block;
}
.input-font-weight /deep/ .el-input__inner {
  text-align: center;
  border-radius: 2px 0px 0px 2px;
}
.input-font-weight /deep/ button.custom-col {
  border-radius: 2px 0px 0px 2px;

  &:hover,
  &:focus {
    border: 1px solid #78dcd6;
    border-right: none;
    color: #666666;
    background: #ffffff;
  }
}
.el-select-dropdown__item.selected {
  color: #78dcd6;
}
</style>
