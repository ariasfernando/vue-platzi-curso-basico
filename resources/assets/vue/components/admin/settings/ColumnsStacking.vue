<template>
  <settings-container v-if="element.columns.length > 1" label="Column Stacking">
    <template slot="setting-bottom">
      <el-select
        v-model="mainSetting"
        class="width-full"
        :placeholder="label"
        size="mini">
        <el-option
          v-for="item in columnsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </template>
  </settings-container>
</template>
<script>
import _ from 'lodash';
import SettingMixin from '../mixins/SettingMixin.js';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ColumnsStacking',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      columnsStacking: '',
    };
  },
  computed: {
    columnsOptions() {
      return [
        {
          value: 'normal',
          label: 'Stack Left to Right',
        },
        {
          value: 'invertedStacking',
          label: 'Stack Right to Left',
        },
        {
          value: 'columnsFixed',
          label: 'Fixed Columns',
        },
      ];
    },
  },
  watch: {
    element: {
      handler(newElement) {
        if (newElement.columns.length === 1) {
          this.mainSetting = 'normal';
        }
      },
      deep: true,
    },
    mainSetting(newMainSetting) {
      if (
        newMainSetting !== this.columnsStacking &&
        (newMainSetting === 'invertedStacking' ||
          this.columnsStacking === 'invertedStacking')
      ) {
        // If the new value or the old value is invertedStacking: the columns will reverse
        const columnsClone = _.clone(this.element.columns);
        this.$emit('setting-updated', {
          name: 'columns',
          value: columnsClone.reverse(),
        });
      }
      this.columnsStacking = newMainSetting;
    },
  },
  mounted() {
    this.columnsStacking = this.mainSetting;
  },
};
</script>
<style lang="scss" scoped>
.width-full {
  width: 100%;
}
</style>
