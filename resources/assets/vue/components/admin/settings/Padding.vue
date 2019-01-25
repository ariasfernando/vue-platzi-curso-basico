<template>
  <div
    class="half-style-setting-padding"
    :title="`Padding ${side}`">
    <span class="side-title">{{ uppercaseSide }}</span>
    <stui-input-number
      v-model="padding"
      v-validate="'required'"
      :min="min"
      :controls="true" />
  </div>
</template>

<script>
import SettingMixin from '../mixins/SettingMixin';

export default {
  name: 'Padding',
  mixins: [SettingMixin],
  props: ['side', 'element'],
  data() {
    return {
      min: 0,
    };
  },
  computed: {
    padding: {
      get() {
        return _.parseInt(this.element.style[`padding${this.side}`]) || 0;
      },
      set(value) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'style',
          name: `padding${this.side}`,
          value: `${value}px`,
        });
      },
    },
    uppercaseSide() {
      return this.side.toUpperCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.half-style-setting-padding {
  width: calc(30% - 15px);
  margin-right: 3px;
  padding: 5px 0;
  float: left;
  position: relative;

  .side-title {
    color: #bdbfbb;
    font-size: 10px;
    margin-bottom: 2px;
    font-weight: 100;
  }

  .el-input-number /deep/ {
    .el-input-number__decrease,
    .el-input-number__increase {
      width: 17px;
    }
  }
}
</style>
