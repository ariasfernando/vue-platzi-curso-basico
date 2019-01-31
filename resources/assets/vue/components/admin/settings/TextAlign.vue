<template>
  <settings-container label="Horizontal position">
    <template slot="setting-right">
      <stui-field>
        <div class="control is-expanded">
          <el-button
            plain size="mini"
            class="glyphicon glyphicon-object-align-left"
            :class="{ active: align === 'left' }"
            @click="changeAlignment('left')" />
        </div>
        <div class="control is-expanded">
          <el-button
            plain
            size="mini"
            class="glyphicon glyphicon-object-align-vertical"
            :class="{ active: align === 'center' }"
            @click="changeAlignment('center')" />
        </div>
        <div class="control is-expanded">
          <el-button
            plain
            size="mini"
            class="glyphicon glyphicon-object-align-right"
            :class="{ active: align === 'right' }"
            @click="changeAlignment('right')" />
        </div>
      </stui-field>
    </template>
  </settings-container>
</template>


<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'TextAlign',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      linkName: 'align',
    };
  },
  computed: {
    align: {
      get() {
        return this.element.attribute[this.linkName];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'attribute',
          name: this.linkName,
          value: newValue,
        });
      },
    },
  },
  methods: {
    changeAlignment(newValue) {
      this.align = newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../stensul-ui/scss/stui.scss';
.el-button {
  width: 100%;
  padding: 4px;
  height: 28px;
  border-color: $stui-input-border-color;
  &:before{
    color: $stui-input-border-color;
  }
  &:focus,
  &:hover {
    color: inherit;
    border-color: $stui-color-secondary;
    background-color: inherit;
  }
  &.active {
    color: #ffffff;
    border-color: $stui-color-secondary;;
    background-color: $stui-color-secondary;
    &:before{
      color: #ffffff;
    }
  }
}
</style>
