<template>
  <SettingsContainer label="Columns">
    <template slot="setting-right">
      <StuiInputNumber
        v-model="columnsCounter" />
    </template>
  </SettingsContainer>
</template>
<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'ColumnsCounter',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      columnsStacking: '',
    };
  },
  computed: {
    columnsCounter: {
      get() {
        return this.element.columns.length;
      },
      set(value) {
        const column = value;
        const numColumn = this.element.columns.length;
        if (numColumn === column) {
          return true;
        }
        if (numColumn > column) {
          this.$store.commit('module/removeColumn', {
            rowId: this.element.id,
            index: column,
            number: numColumn - column,
          });
        }
        if (numColumn < column) {
          for (let i = numColumn; i < column; i++) {
            this.$store.dispatch('module/addColumn', {
              rowId: this.element.id,
            });
          }
        }
        this.$store.dispatch('module/normalizeColumns', {
          rowId: this.element.id,
        });
        return true;
      },
    },
  },
};
</script>
