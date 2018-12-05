<template>
  <div class="col-xs-12 library">
    <div class="row header">
      <div class="col-xs-5 header-col">
        <div class="pull-left">
          <stui-button class="router-remove-underline" type="default">
            <i class="glyphicon glyphicon-menu-left" />
            <router-link to="/">Back</router-link>
          </stui-button>
        </div>
        <div class="col-xs-10 section-title vertical-center">
          {{ library.id ? `Edit ${library.name}` : 'New' }} Library
        </div>
      </div>
      <div class="col-xs-2 header-col">
        <stui-switch-desktop-mobile v-model="buildingMode" />
      </div>
      <div class="col-xs-5 header-col">
        <div class="vertical-center pull-right">
          <stui-button class="btn-margin-right" type="primary" @click="openEditModal">Edit Menu</stui-button>
          <stui-button type="primary" :disabled="errors.any()" @click="saveLibrary">
            Save
            <i class="glyphicon glyphicon-menu-right" />
          </stui-button>
        </div>
      </div>
    </div>
    <div v-if="ready" class="row">
      <column-bar-container side="left" class="edit-library-column">
        <label-item-container v-b-toggle.library-settings label="Settings" icon="glyphicon-cog" />
        <b-collapse id="library-settings" visible accordion="library">
          <b-card class="control">
            <settings-group-container :settings-group="settingsLayout" :get-value="getValue" :set-value="setValue" />
          </b-card>
        </b-collapse>
        <label-item-container v-b-toggle.library-styles label="Styles" icon="glyphicon-cog" />
        <b-collapse id="library-styles" accordion="library">
          <b-card class="control">
            <settings-group-container :settings-group="stylesLayout" :get-value="getValue" :set-value="setValue" />
          </b-card>
        </b-collapse>
      </column-bar-container>
      <column-bar-container side="left" class="edit-library-column is-center-column">
        <dummy-module :config="library.config" :building-mode="buildingMode" />
      </column-bar-container>
    </div>
    <modal-container
      v-if="editMenu"
      button-close-text="Cancel"
      button-submit-text="Save"
      title="Edit Menu "
      subtitle="(Drag modules into the order you prefer)"
      @close-modal="editMenu = false"
      @submit-modal="saveMenu">
      <library-menu-editor :library="libraryCopy" :modules="modules" />
    </modal-container>
    <modal-container
      v-if="editPropietaryStyles"
      button-close-text="Cancel"
      button-submit-text="Save"
      title="Add Propietary Styles "
      @close-modal="closePropietaryStyles"
      @submit-modal="savePropietaryStyles">
      <code-editor v-model="propietaryStyles" type="css" height="calc(100vh - 126px)" />
    </modal-container>
  </div>
</template>

<script>
  import CodeEditor from './CodeEditor.vue';
  import ColumnBarContainer from '../common/containers/ColumnBarContainer.vue';
  import configService from '../../services/config';
  import DummyModule from './partials/DummyModule.vue'
  import LabelItemContainer from '../common/containers/LabelItemContainer.vue';
  import LibraryMenuEditor from './LibraryMenuEditor.vue';
  import libraryService from '../../services/library';
  import ModalContainer from '../common/containers/ModalContainer.vue';
  import settingsLayout from './libraryLayout/Settings';
  import SettingsGroupContainer from '../common/containers/SettingsGroupContainer.vue';
  import stylesLayout from './libraryLayout/Styles';

  export default {
    name: 'EditLibrary',
    components: {
      CodeEditor,
      ColumnBarContainer,
      DummyModule,
      LabelItemContainer,
      LibraryMenuEditor,
      ModalContainer,
      SettingsGroupContainer,
    },
    data() {
      return {
        campaignConfig: {},
        editMenu: false,
        editPropietaryStyles: false,
        espList: {},
        library: {},
        libraryCopy: {},
        propietaryStyles: {},
        modules: [],
        ready: false,
        state: '',
        buildingMode: 'desktop',
      };
    },
    computed: {
      settingsLayout() {
        return settingsLayout;
      },
      stylesLayout() {
        return stylesLayout;
      },
      fontsOptions() {
        const fontsOptions = [];
        const temp = {};
        _.each(this.$_app.config.fonts, (group, index) => {
          group.map((font) => {
            if (index === 'custom') {
              temp[font.name] = font.name;
            } else {
              temp[font] = font;
            }
          });
        });
        Object.keys(temp).forEach((name) => {
          fontsOptions.push({
            value: name,
            label: name,
          });
        });
        return fontsOptions;
      },
      listLinkDecoration() {
        return [
          {
            label: 'Underline',
            enable: 'underline',
            disabled: 'none',
            icon: 'fa fa-underline',
          },
        ];
      },
    },
    methods: {
      getSettings(settings) {
        return settings.filter(this.getDependsOn);
      },
      getStyles(styles) {
        return styles.filter(this.getDependsOn);
      },
      getDependsOn(element) {
        let show = true;
        _.forEach(element.dependsOn, (dependOn) => {
          if (!_.get(this, dependOn.path)) {
            show = false;
          }
        });
        return show;
      },
      getValue(path) {
        return _.get(this, path);
      },
      setValue({ value, path, name }) {
        const completePath = (path !== undefined ? `${path}.` : '') + name;
        _.set(this, completePath, value);
      },
      updateToggle(element) {
        this.library.config[element] = !this.library.config[element];
      },
      loadLibrary() {
        libraryService.espProviders()
          .then((response) => {
            // const espList = { none: { label: 'none', value: 'none' } }; We will need this in [STD-444]
            _.forEach(response, (esp, key) => {
              response[key].label = esp.title;
              response[key].value = key;
            });
            // this.espList = { ...espList, ...response }; We will need this in [STD-444]
            this.espList = response; // We will remove this line in [STD-444]
          })
          .catch(() => {
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
        const libraryId = this.$route.params.id;

        if (libraryId) {
          libraryService.getLibrary(libraryId)
            .then((response) => {
              this.library = response.library;
              if (response.modules) {
                this.loadModules(response.modules);
              }
              this.ready = true;
            })
            .catch(() => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
        } else {
          libraryService.newLibrary()
            .then((response) => {
              this.library = response.library;
              this.loadModules(response.modules);
              this.ready = true;
            })
            .catch(() => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
        }
      },
      openEditModal() {
        this.libraryCopy = _.cloneDeep(this.library);
        this.editMenu = true;
      },
      saveMenu() {
        const emptyModules = this.libraryCopy.modules.find((element) => {
          if (element.type === 'sub-menu') {
            return element.modules.length === 0 || this.areEmptyModules(element.modules);
          }
          return element.name === '' || element.moduleId === '';
        });

        if (emptyModules) return;

        this.library.modules = this.libraryCopy.modules;
        this.library.config.fixedModules = this.libraryCopy.config.fixedModules;
        this.libraryCopy = {};
        this.editMenu = false;
      },
      areEmptyModules(modulesList) {
        return modulesList.find(module => (
          module.name === '' || module.moduleId === ''
        ));
      },
      saveLibrary() {
        const formData = {
          name: this.library.name,
          description: this.library.description,
          config: this.library.config,
          modules: this.library.modules,
        };

        if (this.library.id) {
          formData.libraryId = this.library.id;
          libraryService.saveLibrary(formData)
            .then((response) => {
              if (response.message === 'SUCCESS') {
                window.location.href = `${this.$_app.config.baseUrl}/admin/library`;
              }
            })
            .catch((error) => {
              if (error.status === 422) {
                this.$root.$toast(
                  this.$options.filters.parseValidationErrors(error), {
                    className: 'et-error',
                    closeable: true,
                    duration: 10000,
                  },
                );
              } else {
                this.$root.$toast('Oops! There was an error', {className: 'et-error'});
              }
            });
        } else {
          libraryService.createLibrary(formData)
            .then((response) => {
              if (response.message === 'SUCCESS') {
                window.location.href = `${this.$_app.config.baseUrl}/admin/library`;
              } else if (response.message === 'ERROR_EXISTS') {
                this.$root.$toast('Library already exists', { className: 'et-error' });
              }
            })
            .catch((error) => {
              if (error.status === 422) {
                this.$root.$toast(
                  this.$options.filters.parseValidationErrors(error), {
                    className: 'et-error',
                    closeable: true,
                    duration: 10000,
                  },
                );
              } else {
                this.$root.$toast('Oops! There was an error', { className: 'et-error' });
              }
            });
        }
      },
      extractErrors(errArr) {
        const errors = [];
        Object.keys(errArr).forEach(key => {
          errors.push(errArr[key][0]);
        });
        return errors;
      },
      toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'none';

        const libMargin = document.getElementById('admin-library-container');
        libMargin.className -= ('col-xs-12');

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = 0;
      },
      loadModules(modules) {
        const modulesToAdd = [];
        modules.forEach((data) => {
          modulesToAdd.push({ value: data });
        });
        this.modules = modulesToAdd;
      },
      handleSelect(item) {
        this.addItem(item.value);
        this.state = '';
      },
    },
    created() {
      configService.getConfig('campaign').then((response) => {
        this.campaignConfig = response;
        this.loadLibrary();
      });
    },
    mounted() {
      this.toggleSidebar();
    },
  };
</script>

<style lang='less'>
@stensul-purple: #514960;
@stensul-white: #ffffff;
@stensul-purple-light: lighten(@stensul-purple, 20%);
@focus: #69dac8;

@brand-primary: lighten(@stensul-purple, 35%);
@brand-secondary: @stensul-purple-light;

.library {
  padding-top: 46px;
  margin-top: -15px;
  .edit-library-column {
    height: calc(100vh - 103px)!important;
    &.is-center-column {
      background-color: #f0f0f0;
      // this should be updated to 540 if a 3rd column is added
      width: calc(100vw - 270px);
      .scrollbar-container-inner {
        padding-top: 20px;
        padding-bottom: 20px;
        // this should be removed if a 3rd column is added
        padding-right: 270px;
      }
    }
  }
  .control-label {
    width: 30% !important;
  }
  .header {
    color: @stensul-purple;
    background-color: @stensul-white;
    height: 46px;
    padding: 7px 0px;
    box-shadow: 0px 0px 4px #999999;
    z-index: 2;
    position: fixed;
    top: 56px;
    z-index: 2;
    left: 15px;
    right: 15px;
    .header-col {
      height: 100%;
    }
    .vertical-center {
      min-height: 100%;
      display: flex;
      align-items: center;
    }
    .section-title {
      font-size: 18px;
      font-family: 'Open Sans', Arial, sans-serif;
      font-weight: 300;
    }

    .btn-margin-right{
      margin-right: 10px;
    }
    .stui-switch-desktop-mobile {
      margin-top: 2px;
    }
  }
}
</style>
