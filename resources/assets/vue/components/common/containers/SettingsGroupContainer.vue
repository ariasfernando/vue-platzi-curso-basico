<template>
  <div>
    <group-container
      v-for="(settingGroup, groupKey) in settingsLayout"
      :key="`groupKey-${groupKey}`">
      <settings-container
        :no-label="!settingGroup.groupLabel"
        :label="settingGroup.groupLabel">
        <template slot="setting-bottom">
          <settings-container
            v-for="(setting, index) in getSettings(settingGroup.settings)"
            :key="`settingGroup-${groupKey}-setting-${setting.name}`"
            :label="setting.label"
            :no-label="!setting.label"
            :custom-class="{ 'is-first': index === 0 }">
            <template :slot="setting.settingSlot || 'setting-bottom'">
              <component
                :is="setting.type"
                v-validate="setting.validate"
                :value="getValue((setting.path !== undefined ? `${setting.path}.`:'')+setting.name)"
                :placeholder="setting.placeholder"
                :name="setting.name"
                :list="getValue(setting.listPath)"
                :is-numbered="setting.isNumbered"
                :get-split="setting.getSplit"
                :set-join="setting.setJoin"
                :multiple="setting.multiple"
                :text="setting.text"
                :type="setting.propType"
                :width="setting.width"
                :validation-notif="{
                  msg: errors.first(setting.name),
                  type: 'error',
                  show: errors.has(setting.name),
                }"
                @click="()=>{$emit(setting.click); $emit('click', setting.click)}"
                @input="(value)=> setValue(value, setting.path, setting.name)" />
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
import AclMixing from 'stensul/components/admin/mixins/AclMixin';

export default {
  name: 'SettingsGroupContainer',
  components: {
    GroupContainer,
    SettingsContainer,
  },
  mixins: [AclMixing],
  props: ['settings', 'settings-layout'],
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    getSettings(settings) {
      return settings.filter(this.filterElements);
    },
    filterElements(element) {
      let show = true;
      _.forEach(element.dependsOn, (dependOn) => {
        if (!this.getValue(dependOn.path)) {
          show = false;
        }
      });
      if (!this.$can(element.aclName)) {
        show = false;
      }
      return show;
    },
    getValue(path) {
      return _.get(this.settings, path);
    },
    setValue(value, path, name) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$emit('set-value', {
          value,
          path,
          name,
        });
      }, 300);
    },
  },
};
</script>
