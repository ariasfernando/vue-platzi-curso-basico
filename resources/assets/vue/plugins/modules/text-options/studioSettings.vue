<template>
  <div>
    <SettingsContainer :label="plugin.title" :arrow="arrowState" @toggleArrow="setSlideToggles">
      <template slot="setting-right">
        <StuiToggleButton :value="plugin.enabled" @change="toggle" />
      </template>
    </SettingsContainer>
    <b-collapse :id="pluginKey" :visible="arrowState">
      <div class="btn-group">
        <ElButton
          v-for="(option, optionName) in options"
          :key="optionName"
          v-b-tooltip.hover
          :class="[option.icon , {'active': plugin.config.options[optionName]
            ? plugin.config.options[optionName].value : undefined}]"
          :title="option.label"
          :data-tooltip="option.label"
          size="mini"
          @click.prevent="toggleOption(optionName, plugin.config.options[optionName]
            ? plugin.config.options[optionName].value : undefined)" />
      </div>
      <GroupContainer label="Advanced Settings">
        <!-- forecolor -->
        <template v-if="plugin.config.options.forecolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <SettingsContainer label="Color List By Library">
            <template slot="setting-right">
              <StuiToggleButton
                :value="plugin.config.options.forecolor.textcolor_from_library"
                @change="newValue => changeOption(newValue, 'forecolor', 'textcolor_from_library')" />
            </template>
          </SettingsContainer>
        </template>
        <template v-if="plugin.config.options.forecolor.value">
          <SettingsContainer
            v-if="!plugin.config.options.forecolor.textcolor_from_library && $can('tiny-plugin-forecolor-palette')"
            label="Color List">
            <template slot="setting-right">
              <StuiInputText
                v-model="textColorMap"
                v-validate="'required'"
                placeholder="[{ label: 'Black', value: '#000000' },{ label: 'Gray', value: '#474646' },
                { label: 'Blue', value: '#79A8C9' },{ label: 'Red', value: '#CD202C' }]" />
            </template>
          </SettingsContainer>
        </template>
        <template v-if="plugin.config.options.forecolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <SettingsContainer
            v-if="plugin.config.options.forecolor.textcolor_from_library"
            key="forecolor_palette_name"
            label="Palette Name">
            <template slot="setting-right">
              <StuiInputText
                v-model="palette_name"
                v-validate="'required'"
                placeholder="name" />
            </template>
          </SettingsContainer>
        </template>
        <!-- backcolor -->
        <template v-if="plugin.config.options.backcolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <SettingsContainer label="Highlight Color List By Library">
            <template slot="setting-right">
              <StuiToggleButton
                :value="plugin.config.options.backcolor.backcolor_from_library"
                @change="newValue => changeOption(newValue, 'backcolor', 'backcolor_from_library')" />
            </template>
          </SettingsContainer>
        </template>
        <template v-if="plugin.config.options.backcolor.value">
          <SettingsContainer
            v-if="!plugin.config.options.backcolor.backcolor_from_library && $can('tiny-plugin-forecolor-palette')"
            label="Highlight Color List">
            <template slot="setting-right">
              <StuiInputText
                v-model="backColorMap"
                v-validate="'required'"
                placeholder="[{ label: 'Yellow', value: '#E3EB05' },{ label: 'Orange', value: '#FC9264' },
                { label: 'Pink', value: '#FC6487' },{ label: 'Blue', value: '#64EAFC' }]" />
            </template>
          </SettingsContainer>
        </template>
        <template v-if="plugin.config.options.backcolor.value && $can('tiny-plugin-forecolor-palette-library')">
          <SettingsContainer v-if="plugin.config.options.backcolor.backcolor_from_library" label="Palette Name">
            <template slot="setting-right">
              <StuiInputText
                v-model="back_palette_name"
                v-validate="'required'"
                placeholder="name" />
            </template>
          </SettingsContainer>
        </template>
        <!--settings-->
        <template v-for="(tinySetting, key) in settings">
          <!-- Input if config needs it -->
          <SettingsContainer
            v-if="showSetting(tinySetting.dependsOn) && $can(`tiny-plugin-${tinySetting.aclName || key}`)"
            :key="key"
            :label="tinySetting.title"
            :checkbox="checkboxValue(tinySetting.checkbox, plugin.config.settings[tinySetting.key].content)"
            :disabled="isDisabled(tinySetting.isDisabled, tinySettingContent(plugin.config.settings[tinySetting.key].content))"
            @checkboxChange="(value)=>checkboxChange(value, tinySetting)">
            <template slot="setting-right">
              <ElInputNumber
                v-if="tinySetting.type === 'number'"
                v-b-tooltip.hover
                :value="plugin.config.settings[tinySetting.key].content || 0"
                :title="key"
                :min="0"
                :name="key"
                @change="(value)=>changeSetting(value, tinySetting.key)" />
              <StuiSelect
                v-else-if="tinySetting.type === 'select'"
                :value="plugin.config.settings[tinySetting.key].content"
                :list="tinySetting.options"
                @change="(value) => changeSetting(value, tinySetting.key)" />
              <StuiInputText
                v-else-if="tinySetting.type === 'text'"
                v-b-tooltip.hover
                :title="key"
                :name="key"
                :value="tinySettingContent(plugin.config.settings[tinySetting.key].content)"
                @change="(value)=>changeSetting(value, tinySetting.key)" />
              <Component
                :is="tinySetting.type"
                v-else
                v-bind="props(tinySetting, key)"
                @change="(value)=>changeSetting(value, tinySetting.key)" />
            </template>
          </SettingsContainer>
        </template>
      </GroupContainer>
    </b-collapse>
  </div>
</template>

<script>
import GroupContainer from '../../../components/common/containers/GroupContainer.vue';
import SettingsContainer from '../../../components/common/settings/containers/SettingsContainer.vue';
import configsView from './studioConfigsView';
import pluginMixinAdmin from '../mixins/pluginMixinAdmin';

export default {
  components: {
    GroupContainer,
    SettingsContainer,
  },
  mixins: [pluginMixinAdmin],
  props: ['name', 'element', 'plugin'],
  computed: {
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    module() {
      return this.$store.getters['module/module'];
    },
    settings() {
      return configsView().settings;
    },
    options() {
      return configsView().options;
    },
    pluginEnabled: {
      get() {
        return this.plugin.enabled;
      },
      set(value) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: value,
        };
        this.$store.commit('module/togglePlugin', payload);
      },
    },
    textColorMap: {
      get() {
        const value = this.plugin.config.options.forecolor.textcolor_map;
        return typeof value === 'object' ? JSON.stringify(value) : value;
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          this.changeOption(JSON.parse(value), 'forecolor', 'textcolor_map');
        } else if (_.isEmpty(value)) {
          this.changeOption(value, 'forecolor', 'textcolor_map');
        }
      },
    },
    backColorMap: {
      get() {
        const value = this.plugin.config.options.backcolor.backcolor_map;
        return typeof value === 'object' ? JSON.stringify(value) : value;
      },
      set(value) {
        if (Application.utils.isJsonString(value)) {
          this.changeOption(JSON.parse(value), 'backcolor', 'backcolor_map');
        } else if (_.isEmpty(value)) {
          this.changeOption(value, 'backcolor', 'backcolor_map');
        }
      },
    },
    palette_name: {
      get() {
        return this.plugin.config.options.forecolor.palette_name;
      },
      set(value) {
        this.changeOption(value, 'forecolor', 'palette_name');
      },
    },
    back_palette_name: {
      get() {
        return this.plugin.config.options.backcolor.palette_name;
      },
      set(value) {
        this.changeOption(value, 'backcolor', 'palette_name');
      },
    },
  },
  methods: {
    props(tinySetting) {
      return {
        defaulValue: tinySetting.defaultValue,
        disabled: this.isDisabled(tinySetting.isDisabled, this.tinySettingContent(this.plugin.config.settings[tinySetting.key].content)),
        falseText: tinySetting.falseText,
        list: tinySetting.list,
        min: tinySetting.min,
        multiselect: tinySetting.multiselect,
        muteOn: tinySetting.muteOn,
        option: tinySetting.option,
        value: this.plugin.config.settings[tinySetting.key].content,
      };
    },
    showSetting(dependsOn) {
      if (dependsOn) {
        return _.get(
          this.plugin,
          `config.${dependsOn.config}.${dependsOn.name}.value`,
          false,
        );
      }
      return true;
    },
    toggleOption(optionName, oldValue) {
      const value = !oldValue;
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `options.${optionName}.value`,
        value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    changeOption(value, subOption, settingName) {
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `options.${subOption}.${settingName}`,
        value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    changeSetting(value, settingName) {
      const payload = {
        plugin: this.name,
        componentId: this.element.id,
        path: `settings.${settingName}.content`,
        value: Application.utils.isJsonString(value)
          ? JSON.parse(value)
          : value,
      };
      this.$store.commit('module/setPluginElementConfig', payload);
    },
    tinySettingContent(content) {
      if (content) {
        return typeof content === 'object' ? JSON.stringify(content) : content;
      }
      return 0;
    },
    isDisabled(isDisabled, content) {
      return isDisabled && content
        ? isDisabled(this.tinySettingContent(content))
        : false;
    },
    checkboxValue(checkbox, val) {
      return checkbox ? val !== undefined && val !== 0 && val !== '0' && val !== false : undefined;
    },
    checkboxChange(value, tinySetting) {
      const val = value ? tinySetting.defaultValue : false;
      this.changeSetting(val, tinySetting.key);
    },
  },
};
</script>
<style lang='scss' scoped>
.font-mce-ico {
  font-family: tinymce, Arial;
}
.mce-i-forecolor:before {
  border-bottom: 2px solid #333;
  margin-top: 2px;
}
.mce-i-backcolor:before {
  padding: 4px;
  background: #bbb;
}
.btn-group {
  text-align: left;
  padding-bottom: 10px;
}
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
}
.btn-group.number-input {
  text-align: right;
  padding: 10px 0;
}
.el-button {
  width: 34px;
  padding: 4px 4px;
  margin: 2.5px;
  height: 32px;
}
</style>
