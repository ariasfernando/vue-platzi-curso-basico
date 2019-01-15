<template>
  <settings-container :label="plugin.title">
    <template slot="setting-right">
      <el-button plain class="glyphicon glyphicon-object-align-top" size="mini" :class="{ active: value === 'top' }" @click="changeAlignment('top')" />
      <el-button plain class="glyphicon glyphicon-object-align-horizontal" size="mini" :class="{ active: value === 'middle' }" @click="changeAlignment('middle')" />
      <el-button plain class="glyphicon glyphicon-object-align-bottom" size="mini" :class="{ active: value === 'bottom' }" @click="changeAlignment('bottom')" />
    </template>
  </settings-container>
</template>

<script>
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';

export default {
  components: { SettingsContainer },
  props: ['name', 'plugin', 'moduleId', 'columnId'],
  data() {
    return {
      options: this.plugin.config.options,
    };
  },
  computed: {
    modules() {
      return this.$store.getters['campaign/modules'];
    },
    column() {
      return this.modules[this.moduleId].structure.columns[this.columnId];
    },
    value() {
      return this.column.container.attribute.valign;
    },
  },
  methods: {
    changeAlignment(value) {
      const payload = {
        moduleId: this.moduleId,
        columnId: this.columnId,
        subComponent: 'container',
        link: 'attribute',
        property: 'valign',
        value,
      };
      this.$store.commit('campaign/saveColumnProperty', payload);
    },
  },
};
</script>
<style lang='scss' scoped>
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
