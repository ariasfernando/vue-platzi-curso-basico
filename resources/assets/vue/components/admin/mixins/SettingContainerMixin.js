import * as elementSettings from '../settings';
import GroupContainer from '../../common/containers/GroupContainer.vue';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';
import settingsDefault from './../settingsDefault';
import pluginsLayout from '../pluginsLayout';
import AclMixing from './AclMixin';

export default {
  components: {
    GroupContainer,
    SettingsContainer,
    LabelItemContainer,
    'input-border-group': elementSettings.BorderGroup,
    'input-button-width': elementSettings.ButtonWidth,
    'input-caret': elementSettings.ButtonCaret,
    'input-class-input': elementSettings.ClassInput,
    'input-columns-stacking': elementSettings.ColumnsStacking,
    'input-font-family': elementSettings.FontFamily,
    'input-font-weight': elementSettings.FontWeight,
    'input-generic-code': elementSettings.GenericCode,
    'input-generic-color': elementSettings.GenericColor,
    'input-generic-file': elementSettings.GenericFile,
    'input-generic-number': elementSettings.GenericNumber,
    'input-generic-switch': elementSettings.GenericSwitch,
    'input-generic-text': elementSettings.GenericText,
    'input-horizontal-padding-group': elementSettings.HorizontalPaddingGroup,
    'input-image-size': elementSettings.ImageSize,
    'input-letter-spacing': elementSettings.LetterSpacing,
    'input-padding-group': elementSettings.PaddingGroup,
    'input-text-align': elementSettings.TextAlign,
    'input-vertical-align': elementSettings.VerticalAlign,
    'input-width': elementSettings.Width,
    'input-columns-counter': elementSettings.ColumnsCounter,
  },
  mixins: [AclMixing],
  props: ['columnId'],
  computed: {
    settings() {
      return settingsDefault[this.type]().componentSettings;
    },
    filteredSettings() {
      return this.settings.filter(setting =>
        //this.hasPermissionsInGroup(setting, `std-${this.typeAcl}_`),
        true
      );
    },
    pluginsGroups() {
      const pluginsGroups = pluginsLayout[this.type] ? pluginsLayout[this.type]().componentPlugins : [];
      return pluginsGroups.filter(this.filterPlugin);
    },
    module() {
      return this.$store.getters['module/module'];
    },
    type() {
      const type = this.currentElement.type;
      return type === 'studio' ? 'module' : type;
    },
    typeAcl() {
      return this.type === 'column-element' ? 'column' : this.type;
    },
    currentElementId() {
      return this.$store.getters['module/currentElementId'];
    },
    currentElement() {
      return this.currentElementId ? this.getElement(this.currentElementId) : this.module;
    },
    currentRow() {
      let element = false;
      _.forEach(this.module.structure.rows, (row) => {
        if (row.id === this.currentElementId) {
          element = row;
          return false;
        }
        _.forEach(row.columns, (column) => {
          if (column.id === this.currentElementId) {
            element = row;
            return false;
          }
          _.forEach(column.components, (currentComponent) => {
            if (currentComponent.id === this.currentElementId) {
              element = row;
              return false;
            }
            return true;
          });
          return !element;
        });
        return !element;
      });
      return element;
    },
    currentColumnIndex() {
      let columnIndex = false;
      _.forEach(this.module.structure.rows, (row, currentColumnIndex) => {
        _.forEach(row.columns, (column, currentColumnIndex) => {
          if (column.id === this.currentElementId) {
            columnIndex = currentColumnIndex;
            return false;
          }
          _.forEach(column.components, (currentComponent) => {
            if (currentComponent.id === this.currentElementId) {
              columnIndex = currentColumnIndex;
              return false;
            }
            return true;
          });
          return columnIndex === false;
        });
        return columnIndex === false;
      });
      return columnIndex;
    },
    currentRowIndex() {
      let elementIndex = false;
      _.forEach(this.module.structure.rows, (row, currentRowIndex) => {
        if (row.id === this.currentElementId) {
          elementIndex = currentRowIndex;
          return false;
        }
        _.forEach(row.columns, (column, currentColumnIndex) => {
          if (column.id === this.currentElementId) {
            elementIndex = currentRowIndex;
            return false;
          }
          _.forEach(column.components, (currentComponent) => {
            if (currentComponent.id === this.currentElementId) {
              elementIndex = currentRowIndex;
              return false;
            }
            return true;
          });
          return elementIndex === false;
        });
        return elementIndex === false;
      });
      return elementIndex;
    },
  },
  methods: {
    getElement(elementId) {
      let element = false;
      _.forEach(this.module.structure.rows, (row) => {
        if (row.id === elementId) {
          element = row;
          return false;
        }
        _.forEach(row.columns, (column) => {
          if (column.id === elementId) {
            element = column;
            return false;
          }
          _.forEach(column.components, (currentComponent) => {
            if (currentComponent.id === elementId) {
              element = currentComponent;
              return false;
            }
            return true;
          });
          return !element;
        });
        return !element;
      });
      return element;
    },
    settingProps(setting) {
      return {
        'column-id': this.currentColumnIndex,
        'default-value': setting.value,
        'false-text': setting.falseText,
        'is-disable-percentage': setting.isDisablePercentage,
        'is-inverted': setting.isInverted,
        'is-percentage': setting.isPercentage,
        'is-pixel': setting.isPixel,
        'max-percentage': setting.maxPercentage,
        'max-value': setting.maxValue,
        'min-value': setting.minValue,
        'setting-slot': setting.settingSlot,
        'show-setting': this.showSetting(setting),
        'sub-component': setting.subComponent,
        component: this.currentElement,
        element: this.currentElementToSetting(setting.subComponent),
        label: setting.label,
        link: setting.link,
        module: this.module,
        name: setting.name,
        row: this.currentRow,
        'no-label': setting.noLabel,
        options: setting.options,
        placeholder: setting.placeholder,
        setting: setting.type,
        type: setting.type,
      };
    },
    currentElementToSetting(subComponent) {
      if (subComponent) {
        return this.currentElement[subComponent];
      }
      return this.type === 'module' ? this.currentElement.structure : this.currentElement;
    },
    settingGroupFilter(settings) {
      return settings.filter(this.filterSetting);
    },
    filterPlugin(group) {
      let show = false;
      const pluginsToShow = [];
      _.forEach(group.plugins, (item) => {
        const typeAcl = this.typeAcl === 'module' ? '' : `-${this.typeAcl}`;
        if (
          // (this.$can(`std${typeAcl}-plugin-${item.aclName}`) &&
          this.currentElement.plugins[_.camelCase(item.name)]
        ) {
          show = true;
          pluginsToShow.push(item);
        }
        return true;
      });
      group.plugins = pluginsToShow;
      return show;
    },
    filterSetting(group) {
      let show = false;
      const settingsToShow = [];
      _.forEach(group.settings, (item) => {
        if (
          (item.dependOn === undefined || _.get(this, item.dependOn))
          //&& this.$can(`std-${this.typeAcl}_${item.aclName}`)
        ) {
          show = true;
          settingsToShow.push(item);
        }
        return true;
      });
      group.settings = settingsToShow;
      return show;
    },
    pluginFilter(plugins) {
      const typeAcl = this.typeAcl === 'module' ? '' : `-${this.typeAcl}`;
      return plugins.filter(plugin =>
        // this.$can(`std${typeAcl}-plugin-${plugin.aclName}`) &&
        this.currentElement.plugins[_.camelCase(plugin.name)],
      );
    },
    saveElementProperty({ link, subComponent, name, value }) {
      const data = {
        elementId: this.currentElementId,
        subComponent,
        link,
        property: name,
        value,
      };
      this.$store.commit('module/saveElementProperty', data);
    },
    showSetting(setting) {
      if (setting.dependsOn) {
        const element = setting.dependsOn.subComponent
          ? this.currentElement[setting.dependsOn.subComponent]
          : this.currentElement;
        return element[setting.dependsOn.link][setting.dependsOn.name];
      }
      return true;
    },
    getsettingGroupKey(elementId, groupKey) {
      return `element-${elementId}-settingGroup-${groupKey}`;
    },
    slideToggles(key) {
      const slideToggles = this.$store.getters['module/slideToggles'][key];
      return slideToggles === undefined ? true : slideToggles;
    },
    setSlideToggles(key, value) {
      this.$store.commit('module/slideToggles', {
        key,
        value,
      });
    },
  },
};
