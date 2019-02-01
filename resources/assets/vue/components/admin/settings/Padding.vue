<template>
  <div>
    <stui-input-number
      v-model="padding"
      v-validate="'required'"
      :min="min"
      :controls="true" />
    <div class="side-title">
      {{ side }}
    </div>
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
  },
};
</script>
<style lang="scss" scoped>
@import '../../../stensul-ui/scss/stui.scss';
.side-title {
  color: $stui-label-color;
  font-size: 10px;
  font-weight: 100;
  text-align: center;
  margin-top: 5px;
}
</style>
