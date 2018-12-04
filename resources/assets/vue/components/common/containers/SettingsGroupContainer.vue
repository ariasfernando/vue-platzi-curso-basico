<template>
  <div>
    <group-container
      v-for="(settingGroup, groupKey) in settingsGroup"
      :key="`groupKey-${groupKey}`">
      <settings-container
        :no-label="!settingGroup.groupLabel"
        :label="settingGroup.groupLabel">
        <template slot="setting-bottom">
          <settings-container
            v-for="(setting) in getSettings(settingGroup.settings)"
            :key="`settingGroup-${groupKey}-setting-${setting.name}`"
            :label="setting.label">
            <template :slot="setting.settingSlot || 'setting-bottom'">
              <component
                :is="setting.type"
                v-validate="setting.validate"
                :value="getValue((setting.path !== undefined ? `${setting.path}.`:'')+setting.name)"
                :placeholder="setting.placeholder"
                :name="setting.name"
                :list="getValue(setting.listPath)"
                :class="{'is-danger': errors.has(setting.name) }"
                @change="(value)=>{setValue({value, path:setting.path, name:setting.name})}" />
              <span
                v-show="errors.has(setting.name)"
                class="help is-danger">
                {{ errors.first(setting.name) }}</span>
            </template>
          </settings-container>
        </template>
      </settings-container>
    </group-container>
  </div>
</template>

<script>
import GroupContainer from './GroupContainer.vue';
import SettingsContainer from '../settings/containers/SettingsContainer.vue';

export default {
  name: 'SettingsGroupContainer',
  components: {
    GroupContainer,
    SettingsContainer,
  },
  props: ['settingsGroup', 'getValue', 'setValue'],
  methods: {
    getSettings(settings) {
      return settings.filter(this.getDependsOn);
    },
    getDependsOn(element) {
      let show = true;
      _.forEach(element.dependsOn, (dependOn) => {
        if (!this.getValue(dependOn.path)) {
          show = false;
        }
      });
      return show;
    },
  },
};
</script>
