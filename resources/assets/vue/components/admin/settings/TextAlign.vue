<template>
  <settings-container label="Horizontal position">
    <template slot="setting-right">
      <el-button
        plain size="mini"
        class="glyphicon glyphicon-object-align-left"
        :class="{ active: align === 'left' }"
        @click="changeAlignment('left')" />
      <el-button
        plain
        size="mini"
        class="glyphicon glyphicon-object-align-vertical"
        :class="{ active: align === 'center' }"
        @click="changeAlignment('center')" />
      <el-button
        plain
        size="mini"
        class="glyphicon glyphicon-object-align-right"
        :class="{ active: align === 'right' }"
        @click="changeAlignment('right')" />
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
.settings-container{
  // Hack inline-block
  font-size: 0;
}
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: #78dcd6;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);

  &:before{
    color: #ffffff;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 33%;
  padding: 4px 0;
  margin-right: 0px;
  height: 26px;
  border-radius: 0px;
  border-right: none;

  &:before{
    color: #999999;
  }

  &:first-of-type {
    margin: 0;
    border-radius: 2px 0px 0px 2px;
    border-right: none;
  }

  &:last-of-type {
    margin: 0;
    border-radius: 0px 2px 2px 0px;
    border-right: 1px solid #dddddd;
  }
}
.el-button:first-child:nth-last-child(2),
.el-button:first-child:nth-last-child(2) ~ button {
    width: 50%;
}
.el-button:first-child:nth-last-child(3),
.el-button:first-child:nth-last-child(3) ~ button {
    width: 33%;
}
.el-button:first-child:nth-last-child(4),
.el-button:first-child:nth-last-child(4) ~ button{
    width: 25%;
}
.padding-zero {
  padding: 0;
}
</style>
