<template>
  <div class="col-xs-12 library">
    <div class="row header" v-sticky="{ zIndex: 999, stickyTop: 0 }">
      <div class="col-xs-9 header-col">
        <div class="pull-left">
          <stui-button class="router-remove-underline" type="default">
            <i class="glyphicon glyphicon-menu-left" />
            <router-link to="/">Back</router-link>
          </stui-button>
        </div>
        <div class="col-xs-11 section-title vertical-center">
          {{ library.id ? `Edit ${library.name}` : 'New' }} Library
        </div>
      </div>
      <div class="col-xs-3 header-col">
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
      <column-bar-container side="left">
        <label-item-container v-b-toggle.library-settings label="Settings" icon="glyphicon-cog" />
        <b-collapse id="library-settings" visible accordion="library-style">
          <b-card class="control">
            <group-container
              v-for="(settingGroup, groupKey) in settingsLayout"
              :key="`groupKey-${groupKey}`">
              <settings-container
                :no-label="!settingGroup.showLabel"
                :label="settingGroup.showLabel">
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
          </b-card>
        </b-collapse>
        <button @click="editPropietaryStyles = true">Open modal</button>
      </column-bar-container>

      <!-- dummy module preview -->
      <dummy-module :config="library.config" />
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
      @close-modal="editPropietaryStyles = false"
      @submit-modal="savePropietaryStyles" />
  </div>
</template>

<script>
  import * as elementSettings from './settings';
  import ColumnBarContainer from '../common/containers/ColumnBarContainer.vue';
  import configService from '../../services/config';
  import DummyModule from './partials/DummyModule.vue'
  import GroupContainer from '../common/containers/GroupContainer.vue';
  import LabelItemContainer from '../common/containers/LabelItemContainer.vue';
  import LibraryMenuEditor from './LibraryMenuEditor.vue';
  import libraryService from '../../services/library';
  import ModalContainer from '../common/containers/ModalContainer.vue';
  import SettingsContainer from '../common/settings/containers/SettingsContainer.vue';
  import settingsLayout from './libraryLayout/Settings';
  import VueSticky from 'vue-sticky';

  export default {
    name: 'EditLibrary',
    components: {
      'input-font-family': elementSettings.FontFamily,
      'input-generic-color': elementSettings.GenericColor,
      ColumnBarContainer,
      GroupContainer,
      LabelItemContainer,
      LibraryMenuEditor,
      ModalContainer,
      SettingsContainer,
      DummyModule,
    },
    data() {
      return {
        campaignConfig: {},
        editMenu: false,
        editPropietaryStyles: false,
        espList: {},
        library: {},
        libraryCopy: {},
        modules: [],
        ready: false,
        state: '',
      };
    },
    directives: {
      'sticky': VueSticky,
    },
    computed: {
      settingsLayout() {
        return settingsLayout;
      },
    },
    methods: {
      getSettings(settings) {
        return settings.filter(this.getDependsOn);
      },
      getDependsOn(setting) {
        let show = true;
        _.forEach(setting.dependsOn, (dependOn) => {
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
        // Add behavior to save library menu
        this.library.modules = this.libraryCopy.modules;
        this.library.config.fixedModules = this.libraryCopy.config.fixedModules;
        this.libraryCopy = {};
        this.editMenu = false;
      },
      savePropietaryStyles(data) {
        this.library.config.propietaryCss = data;
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
  @stensul-white: #FFFFFF;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #69dac8;

  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .library {
    .control-label {
      width: 30% !important;
    }

    margin-top: -15px;

    .header {
      color: @stensul-purple;
      background-color: @stensul-white;
      height: 46px;
      padding: 7px 0px;
      box-shadow: 0px 0px 4px #999999;
      margin-top: -3px;

      .header-col {
        height: 100%;
      }

      .vertical-center {
        min-height: 100%;
        display: flex;
        align-items: center;
      }

      .switch {
        position: relative;
        height: 27px;
        width: 100px;
        background: #C8C8C8;
        border-radius: 3px;
        -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
        margin: 0 auto;
      }

      .switch-label {
        position: relative;
        z-index: 2;
        float: left;
        width: 50px;
        line-height: 23px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
        cursor: pointer;
        margin: 0 !important;

        i {
          display: inline-block;
          vertical-align: sub;
        }
      }

      .switch-label:active {
        font-weight: bold;
      }

      .switch-label-off {
        padding-left: 2px;
      }

      .switch-label-on {
        padding-right: 2px;
      }

      .switch-input {
        display: none;
      }

      .switch-input:checked + .switch-label {
        font-weight: bold;
        color: #fff;
        text-shadow: 0 1px rgba(255, 255, 255, 0.25);
        -webkit-transition: 0.15s ease-out;
        -moz-transition: 0.15s ease-out;
        -o-transition: 0.15s ease-out;
        transition: 0.15s ease-out;
      }

      .switch-input:checked + .switch-label-on ~ .switch-selection {
        left: 50px;
        /* Note: left: 50% doesn't transition in WebKit */
      }

      .switch-selection {
        display: block;
        position: absolute;
        z-index: 1;
        top: 2px;
        left: 2px;
        width: 48px;
        height: 24px;
        background: @brand-secondary;
        border-radius: 3px;
        background-image: -webkit-linear-gradient(top, @brand-primary, @brand-secondary);
        background-image: -moz-linear-gradient(top, @brand-primary, @brand-secondary);
        background-image: -o-linear-gradient(top, @brand-primary, @brand-secondary);
        background-image: linear-gradient(to bottom, @brand-primary, @brand-secondary);
        -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.5), 0 0 2px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.5), 0 0 2px rgba(0, 0, 0, 0.2);
        -webkit-transition: left 0.15s ease-out;
        -moz-transition: left 0.15s ease-out;
        -o-transition: left 0.15s ease-out;
        transition: left 0.15s ease-out;
      }

      .section-title {
        font-size: 18px;
        font-family: 'Open Sans', Arial, sans-serif;
        font-weight: 300;
      }

      .btn-margin-right{
        margin-right: 10px;
      }
    }
  }
</style>
