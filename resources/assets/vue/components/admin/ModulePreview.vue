<template>
  <div>
    <el-row>
      <stui-switch-desktop-mobile v-model="buildingMode" />
    </el-row>
    <el-row class="preview-module-container mt-20">
      <module-container :building-mode="buildingMode" :width-desktop="640" :width-mobile="480">
        <module :module="module" />
      </module-container>
    </el-row>
    <el-row class="mt-20" :gutter="20" type="flex" justify="space-around">
      <el-col :span="4">
        <SettingsContainer label="Created date">
          <template slot="setting-bottom">
            <p>{{ module.created_at }}</p>
          </template>
        </SettingsContainer>
      </el-col>
      <el-col :span="4">
        <SettingsContainer label="Created by">
          <template slot="setting-bottom">
            <p>{{ module.created_by }}</p>
          </template>
        </SettingsContainer>
      </el-col>
      <el-col :span="4">
        <SettingsContainer label="Last modified date">
          <template slot="setting-bottom">
            <p>{{ module.updated_at }}</p>
          </template>
        </SettingsContainer>
      </el-col>
      <el-col :span="4">
        <SettingsContainer label="Last modified by">
          <template slot="setting-bottom">
            <p>{{ module.updated_by }}</p>
          </template>
        </SettingsContainer>
      </el-col>
      <el-col :span="4">
        <SettingsContainer label="Description">
          <template slot="setting-bottom">
            <p>{{ module.description }}</p>
          </template>
        </SettingsContainer>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ModuleContainer from '../common/containers/ModuleContainer.vue';
import SettingsContainer from '../common/settings/containers/SettingsContainer.vue';
import Module from './Module.vue';

export default {
  name: 'ModulePreview',
  components: {
    Module,
    ModuleContainer,
    SettingsContainer,
  },
  props: {
    module: {
      type: [Object],
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      buildingMode: 'desktop',
    };
  },
};
</script>
<style lang="scss" scoped>
.preview-module-container {
  min-height: 206px;
  background: #f0f0f0;
}
.mt-20{
  margin-top: 20px;
}
.settings-container /deep/ label{
  font-weight: 600;
}
</style>

