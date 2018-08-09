<template>
  <div class="col-xs-12 library">
    <div class="row header" v-sticky="{ zIndex: 999, stickyTop: 0 }">
      <div class="col-xs-9 header-col">
        <div class="beta-btn-secondary pull-left">
          <i class="glyphicon glyphicon-menu-left"></i>
          <router-link to="/">Back</router-link>
        </div>
        <div class="col-xs-11 section-title vertical-center" v-if="library.id"> Edit {{library.name}} Library</div>
        <div class="col-xs-11 section-title vertical-center" v-if="!library.id">New Library</div>
      </div>

      <div class="col-xs-3 header-col">
        <div class="vertical-center pull-right">
          <a class="btn btn-continue beta-btn-secondary" href="#" @click.prevent="saveLibrary" :disabled="errors.any()">Save <i class="glyphicon glyphicon-menu-right"></i></a>
        </div>
      </div>
    </div>

    <div class="row">
      <section v-if="ready" class="container">
        <div class="simple-text-config admin-library-form">
          <div class="row">
            <div class="col-xs-12">
                  <div v-if="$route.query.debug" class="col-xs-12">
                    <br><br>
                    <pre>{{ library.config }}</pre>
                  </div>
                  <form id="edit-library" action="/admin/library/edit" method="POST" @submit.prevent="saveLibrary">
                    <tabs>
                        <tab name="Settings" :selected="true">
                            <div class="row">
                              <!-- Field Name -->
                              <div class="col-md-6">
                                <label for="name">Name</label>
                                <p class="control">
                                  <el-input
                                        v-validate="'required'"
                                        v-model="library.name"
                                        placeholder="Enter name here."
                                        :class="{'is-danger': errors.has('name') }"
                                  ></el-input>
                                  <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                                </p>
                              </div>

                              <!-- Field Description -->
                              <div class="col-md-6">
                                <label for="description">Description</label>
                                <p class="control">

                                  <el-input
                                        v-model="library.description"
                                        placeholder="Enter description here."
                                        name="description"
                                  ></el-input>
                                </p>
                              </div>
                            </div>

                            <div class="row" v-if="campaignConfig.preview.show_preheader">
                              <!-- Field Preheader -->
                              <label for="preheader" class="col-sm-4 control-label">Preheader</label>
                              <p class="control col-sm-8">
                                <toggle-button :value="library.config.preheader" @change="updateToggle('preheader')"></toggle-button>
                              </p>
                            </div>

                            <!-- Field Plain text -->
                            <div class="row" v-if="campaignConfig.process_plaintext">
                              <label for="plainText" class="col-sm-4 control-label">Plain Text</label>
                              <p class="control col-sm-8">
                                <toggle-button :value="library.config.plainText" @change="updateToggle('plainText')"></toggle-button>
                              </p>
                            </div>

                            <!-- Field ESP -->
                            <div class="row">
                              <label for="preheader" class="col-sm-4 control-label">ESP</label>
                              <p class="control col-sm-1">
                                <toggle-button :value="library.config.esp" @change="updateToggle('esp')"></toggle-button>
                              </p>
                              <div v-if="library.config.esp" class="col-md-5">
                                <p class="control">
                                  <el-select
                                    size="mini"
                                    v-model="espProvider"
                                    placeholder="Choose ESP"
                                    >
                                    <el-option
                                      v-for="(esp, key) in this.espList"
                                      :key="key"
                                      :label="esp.title"
                                      :value="key">
                                    </el-option>
                                  </el-select>
                                </p>
                              </div>
                            </div>

                            <!-- Field Tagging -->
                            <div class="row" v-if="campaignConfig.enable_tagging">
                              <label for="tagging" class="col-sm-4 control-label">Tags</label>
                              <p class="control col-sm-1">
                                <toggle-button :value="library.config.tagging" @change="updateToggle('tagging')"></toggle-button>
                              </p>
                            </div>

                            <!-- Field Templating -->
                            <div class="row" v-if="campaignConfig.enable_templating">
                              <label for="templating" class="col-sm-4 control-label">Enable templating</label>
                              <p class="control col-sm-1">
                                <toggle-button :value="library.config.templating" @change="updateToggle('templating')"></toggle-button>
                              </p>
                            </div>
                        </tab>

                        <tab name="Template">
                            <div class="row">

                              <!-- Field width -->
                              <div class="col-md-4">
                                <label for="templateWidth">Template width</label>
                                <p class="control">
                                  <el-input-number
                                    size="mini" 
                                    v-validate="'required'"
                                    v-model="library.config.templateWidth"
                                    :class="{'is-danger': errors.has('templateWidth') }"
                                    :name="'templateWidth'"
                                  ></el-input-number>
                                  <span v-show="errors.has('templateWidth')" class="help is-danger">{{ errors.first('templateWidth') }}</span>
                                </p>
                              </div>

                              <!-- Field mobile-width -->
                              <div class="col-md-4">
                                <label for="templateMobileWidth">Template Mobile Width</label>
                                <p class="control">
                                  <el-input-number
                                    size="mini" 
                                    v-validate="'required'"
                                    v-model="library.config.templateMobileWidth"
                                    :class="{'is-danger': errors.has('templateMobileWidth') }"
                                    :name="'templateMobileWidth'"
                                  ></el-input-number>
                                  <span v-show="errors.has('templateMobileWidth')"
                                        class="help is-danger">{{ errors.first('templateMobileWidth') }}</span>
                                </p>
                              </div>

                              <div class="col-md-4">
                                <label for="padding">Padding</label>
                                <p class="control">
                                  <el-input-number
                                      size="mini"
                                      v-validate="'required'"
                                      v-model="library.config.padding"
                                      :class="{'is-danger': errors.has('padding') }"
                                      :name="'padding'"
                                  ></el-input-number>
                                  <span v-show="errors.has('padding')" class="help is-danger">{{ errors.first('padding') }}</span>
                                </p>
                              </div>
                            </div>

                            <div class="row">
                              <!-- Field background-color -->
                              <div class="col-md-4">
                                <input-generic-color
                                  @setting-updated="settingUpdatedHandler"
                                  class="label-bold"
                                  :name="'templateBackgroundColor'"
                                  :type="'generic-color'"
                                  :link="'config'"
                                  :label="'Template Background Color'"
                                  :default-value="library.config.templateBackgroundColor"
                                  :element="library"></input-generic-color>
                              </div>

                              <!-- Field content-background-color -->
                              <div class="col-md-4">
                                <input-generic-color
                                  class="label-bold"
                                  @setting-updated="settingUpdatedHandler"
                                  :name="'contentBackgroundColor'"
                                  :type="'generic-color'"
                                  :link="'config'"
                                  :label="'Content Background Color'"
                                  :default-value="library.config.contentBackgroundColor"
                                  :element="library"></input-generic-color>
                              </div>

                              <!-- Field template background palettes -->
                              <div class="col-md-4">
                                <label for="templateBackgroundPalettes">Template background palettes</label>
                                <p class="control">
                                  <el-input
                                      v-model="library.config.templateBackgroundPalettes"
                                      name="colorPalettes"
                                      placeholder='{ "default": "#FFFFFF", "options": { "White": "#FFFFFF", "Black": "#000000" } }"'
                                  ></el-input>
                                </p>
                              </div>
                            </div>'

                            <div class="row">
                              <!-- Field font-family -->
                              <div class="col-md-3">
                                <input-font-family
                                  class="label-bold"
                                  @setting-updated="settingUpdatedHandler"
                                  :name="'fontFamily'"
                                  :type="'font-family'"
                                  :link="'config'"
                                  :label="'Font Family'"
                                  :default-value="library.config.fontFamily"
                                  :element="library"></input-font-family>
                              </div>

                              <!-- Field font-color -->
                              <div class="col-md-3">
                                <input-generic-color
                                  class="label-bold"
                                  @setting-updated="settingUpdatedHandler"
                                  :name="'fontColor'"
                                  :type="'generic-color'"
                                  :link="'config'"
                                  :label="'Font Color'"
                                  :default-value="library.config.fontColor"
                                  :element="library"></input-generic-color>
                              </div>

                              <!-- Field font-size -->
                              <div class="col-md-3">
                                <label for="fontSize">Font Size</label>
                                <p class="control">

                                  <el-input-number
                                    size="mini" 
                                    v-validate="'required'"
                                    v-model="library.config.fontSize"
                                    :class="{'is-danger': errors.has('fontSize') }"
                                    :name="'fontSize'"
                                  ></el-input-number>
                                  <span v-show="errors.has('fontSize')" class="help is-danger">{{ errors.first('fontSize') }}</span>
                                </p>
                              </div>

                              <!-- Field line-height -->
                              <div class="col-md-3">
                                <label for="lineHeight">Line Height</label>
                                <p class="control">
                                  <el-input-number
                                    size="mini" 
                                    v-validate="'required'"
                                    v-model="library.config.lineHeight"
                                    :class="{'is-danger': errors.has('lineHeight') }"
                                    :name="'lineHeight'"
                                  ></el-input-number>
                                  <span v-show="errors.has('lineHeight')" class="help is-danger">{{ errors.first('lineHeight') }}</span>
                                </p>
                              </div>

                            </div>

                            <div class="row">

                              <!-- Field link-color -->
                              <div class="col-md-3">
                                <input-generic-color
                                  class="label-bold"
                                  @setting-updated="settingUpdatedHandler"
                                  :name="'linkColor'"
                                  :type="'generic-color'"
                                  :link="'config'"
                                  :label="'Link Color'"
                                  :default-value="library.config.linkColor"
                                  :element="library"></input-generic-color>
                              </div>

                              <!-- Field link-decoration -->
                              <div class="col-md-3">
                                <label for="linkDecoration">Link Decoration</label>
                                <p class="control">
                                  <el-button
                                    :class="{'fa fa-underline':true,'active': library.config.linkDecoration === 'underline'}"
                                    size="mini"
                                    @click.native="toggleUnderline"
                                  ></el-button>
                                </p>
                              </div>

                              <!-- Field external-link -->
                              <div class="col-md-3">
                                <label for="externalCssLink">External CSS Link</label>
                                <p class="control">
                                  <el-input
                                    v-model="library.config.externalCssLink"
                                    name="linkColor" 
                                    placeholder="http://www.example.com/css/styles.css"
                                  ></el-input>
                                </p>
                              </div>

                              <!-- Field external-link -->
                              <div class="col-md-3">
                                <label for="colorPalettes">color palettes</label>
                                <p class="control">
                                  <el-input
                                    v-model="library.config.colorPalettes"
                                    name="colorPalettes" 
                                    placeholder="{'palette_name':['000000','Black','474646','Gray','79a8c9','Blue','cd202c','Red']}"
                                  ></el-input>
                                </p>
                              </div>
                            </div>

                            <div class="row">
                              <!-- Field propietary styles -->
                              <div class="col-md-12">
                                <label for="propietaryCss">Propietary Styles</label>
                                <p class="control">
                                  <textarea v-model="library.config.propietaryCss" rows="10" name="propietaryCss" type="text" placeholder=""></textarea>
                                </p>
                              </div>
                            </div>
                        </tab>


                        <tab name="Menu">
                            <!-- Select modules -->
                            <div class="row">
                              <div class="col-md-6">
                                <p>
                                  <button class="btn btn-success btn-add-group" @click.prevent="addGroup">Add Group</button>
                                </p>  
                                <label for="name">Modules to add:</label>
                                <draggable :element="'ul'"
                                            :options="options"
                                            width="100%"
                                            class="components-list"
                                >
                                  <li class="component-item list-group-item" v-for="module in modules" style="border:1px;" :data-module-id="module" @click="addItem(module)">
                                    <p>{{module}}</p>
                                  </li>
                                </draggable>
                              </div>
                              <div class="col-md-6">
                                <label for="name">Menu</label>
                                <div id="modules-container">
                                  <draggable v-model="library.modules" class="drag-component-menu components-list" :options="{group:'menuList'}">
                                    <div v-for="(group, idx) in library.modules" :id="'modules-' + group.name">
                                      <div v-if="group.type == 'sub-menu'" :id="'group-container-' + group.name">
                                        <p :class="{ 'control': true }">
                                          <input v-model="group.name" v-validate="'required'"
                                                  :class="{'input': true, 'is-danger': errors.has('groupName-' + idx) }"
                                                  :name="'modules[' + idx + '][name]'" type="text" placeholder="Enter group name">
                                          <span v-show="errors.has('groupName-' + idx)"
                                                class="help is-danger">{{ errors.first('groupName-' + idx) }}</span>
                                        </p>
                                        <draggable v-model="group.modules" class="drag-component-menu" @add="onAdd" :options="{group:'menuList'}">
                                          <template v-for="(module, idx) in group.modules">
                                            <p class="module-id">{{ module.moduleId }}</p>
                                            <li class="component-item list-group-item">
                                              <input v-model="module.name" v-validate="'required'"
                                                      :class="{'input': true, 'menu-item' : true }" type="text" placeholder="Enter module name">
                                              <span class="glyphicon glyphicon-trash item-remove" @click="deleteItem(group.modules,idx)"></span>
                                            </li>
                                          </template>
                                        </draggable>
                                        <div class="group-remove-container">
                                          <span class="glyphicon glyphicon-trash group-remove" @click.prevent="deleteGroup(idx)"></span>
                                          <hr/>
                                        </div>
                                      </div>
                                      <p class="module-id">{{ group.moduleId }}</p>
                                      <li v-if="group.type == 'item'" class="component-item list-group-item">
                                        <input v-model="group.name" v-validate="'required'"
                                                :class="{'input': true , 'menu-item' : true }" type="text" placeholder="Enter module name">
                                        <span class="glyphicon glyphicon-trash item-remove" @click="deleteItem(library.modules,idx)"></span>
                                        
                                      </li>
                                    </div>
                                  </draggable>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <!-- Field fixed modules" -->
                              <div class="col-md-12">
                                <label for="fixedModules">Fixed modules config:</label>
                                <p class="control">
                                  <textarea v-model="library.config.fixedModules" rows="10" name="fixedModules" type="text" placeholder=""></textarea>
                                </p>
                              </div>
                            </div>
                            <!-- Input submit  -->
                            <div class="row">
                              <div class="col-md-12">
                                <button type="submit" class="btn btn-success pull-right submit-config hidden" :disabled="errors.any()">Submit
                                </button>
                              </div>
                            </div>
                        </tab>
                    </tabs>

                  </form>
                </div>
              </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import libraryService from '../../services/library'
  import configService from '../../services/config'
  import Tabs from '../common/Tabs.vue'
  import Tab from '../common/Tab.vue'
  import VueSticky from 'vue-sticky'
  import * as elementSettings from "./settings";
  import Draggable from 'vuedraggable'

  export default {
    name: 'EditLibrary',
    components: {
      Draggable,
      Tabs,
      Tab,
    "input-font-family": elementSettings.FontFamily,
    "input-generic-color": elementSettings.GenericColor,
    },
    data () {
      return {
        library: {},
        modules: {},
        espList: {},
        ready: false,
        campaignConfig: {},
        options: {
          group:{
            name:'menuList',
            pull: false,
            put: false,
          },
          sort: false,
          ghostClass: "ghost-component-menu",
          chosenClass: "chosen-component-menu",
          dragClass: "drag-component-menu"
        },
      }
    },
    directives: {
      'sticky': VueSticky,
    },
    computed: {
      espProvider: {
        get() {
          return this.library.config.espProvider ? this.library.config.espProvider : null;
        },
        set(espProvider) {
          this.library.config.espProvider = espProvider;
        }
      },
      fixedModules: {
        get() {
          return this.library.config.fixedModules ? this.library.config.fixedModules : "";
        },
        set(fixedModules) {
          this.library.config.fixedModules = JSON.stringify(fixedModules);
        }
      }
    },
    methods: {
      updateToggle(element) {
        this.library.config[element] = !this.library.config[element];
      },
      loadLibrary() {
        libraryService.espProviders()
          .then((response) => {
            this.espList = response;
          })
          .catch((error) => {
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
        let libraryId = this.$route.params.id;

        if (libraryId) {
          libraryService.getLibrary(libraryId)
            .then((response) => {
              this.library = response.library;
              this.modules = response.modules ? response.modules : {};
              this.ready = true;
            })
            .catch((error) => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
        } else {
          libraryService.newLibrary()
            .then((response) => {
              this.library = response.library;
              this.modules = response.modules;
              this.ready = true;
            })
            .catch((error) => {
              this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
            });
        }
      },
      saveLibrary() {

        let formData = {
          name: this.library.name,
          description: this.library.description,
          config: this.library.config,
          modules: this.library.modules
        };

        if (this.library.id) {
          formData.libraryId = this.library.id;
          libraryService.saveLibrary(formData)
            .then((response) => {
              if (response.message === 'SUCCESS') {
                window.location.href = this.$_app.config.baseUrl + "/admin/library";
              }
            })
            .catch((error) => {
              this.$root.$toast('Oops! There was an error', {className: 'et-error'});
            });
        } else {
          libraryService.createLibrary(formData)
            .then((response) => {
              if (response.message === 'SUCCESS') {
                window.location.href = this.$_app.config.baseUrl + "/admin/library";
              } else if ( response.message === 'ERROR_EXISTS' ) {
                this.$root.$toast('Library already exists', {className: 'et-error'});
              }
            })
            .catch((error) => {
                this.$root.$toast('Oops! There was an error', {className: 'et-error'});
            });
        }
      },
      addGroup() {
        this.temporal = this.temporal || 1;
        let tmpName = 'Unnamed Group ' + this.temporal++;

        this.library.modules.push({
          name: tmpName,
          type: 'sub-menu',
          modules: []
        });
      },
      addItem(moduleId) {
        let itemData = {
          name: moduleId,
          moduleId: moduleId, 
          type: 'item',
        }
        this.library.modules.push(itemData);
      },
      deleteGroup(idx) {
        this.library.modules.splice(idx, 1);
      },
      deleteItem(menu, idx) {
        menu.splice(idx, 1);
      },
      toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'none';

        var libMargin = document.getElementById('admin-library-container');
        libMargin.className -= ('col-xs-12');

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = 0;
      },
      onAdd(e){
        let cloneItem = e.item;
        if (cloneItem.parentNode) {
          cloneItem.parentNode.removeChild(cloneItem);
        }
      },
      settingUpdatedHandler(eventData) {
        this.library.config[eventData.name] = eventData.value;
      }
    },
    created () {
      configService.getConfig('campaign').then((response) => {
        this.campaignConfig = response;
        this.loadLibrary();
      });
    },
    mounted () {
      this.toggleSidebar();
    }
  };
</script>

<style lang="less">
  @stensul-purple: #514960;
  @stensul-white: #FFFFFF;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #69dac8;

  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .library {
    margin-top: -15px;

    .header {
      color: @stensul-purple;
      background-color: @stensul-white;
      height: 53px;
      margin-bottom: 20px;
      padding: 17px 0;
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
        margin-top: -1px;
      }

    }

    .section-container {
      background-color: #FFFFFF;
      padding-left: 15px;
    }

    .admin-library-form {
      box-sizing: border-box;
      position: relative;
      padding: 15px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
    }
    select[multiple] {
      height: 100px !important;
    }

    .group-remove-container {
      width: 50%;
      text-align: right;
    }

    .group-remove {
      float: none !important;
      margin-top: 10px;
    }

    .item-remove {
      float: right;
    }

    .item-name {
      width: 80%;
    }

    .is-danger {
      color: red;
    }

    .input-group-addon i {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: text-top;
    }

    .beta-btn-primary{
      font-family: 'Open Sans', Arial, sans-serif;
      font-size: 13px;
      margin-top: -6px;
      background: @stensul-purple;
      border: none;
      padding: 5px 7px;

      &:hover{
        border: none;
      }
    }

    .beta-btn-secondary{
      font-family: 'Open Sans', Arial, sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      padding: 5px 7px;
      border: 1px solid #666666;
      background: @stensul-white;
      border: 1px solid #dddddd;
      transition: all 0.3s linear;
      margin: 0px;
      margin-top: -6px;
      border-radius: 2px;
      cursor: pointer;

      a{
        color: #666666;

        &:hover{
          text-decoration: none;
        }
      }

      &:hover{
        background: @stensul-white;
        color: #666666;
        border: 1px solid @stensul-purple;
      }
    }

    .drag-component-menu{
      min-height: 30px;
      margin-left: 30px;
      
      input{
        width: 50% !important;
      }
      
      hr{
        margin-top: 3px;
        margin-bottom: 10px;
      }

      .menu-item{
        width: 80% !important;
      }
    }

    .components-list {
      padding: 0;
      margin: 0;

      p.module-id {
        color: #DDDDDD;
        font-size: 12px;
        cursor: text;
        margin: 0;
      }

      .component-item{
        cursor: pointer;
        list-style-type: none;
        font-size: 14px;
        background-color: #f4f4f4;
        border: 1px solid #d8d8d8 !important;
        padding: 8px;
        width: 47%;
        margin-right: 4px;
        margin-bottom: 4px;
        text-align: center;
        transition: all 0.3s linear;

        i {
          margin: 0 5px;
          color: #514960;
          font-size: 28px;
        }
        p{
          display: inline-block;
          font-size: 12px;
          margin: 0px;
          padding: 0px;
          font-weight: 400px;
          color: #666666;
          width: 100%;
          font-weight: 300;
          text-align: center;
        }

        &:hover{
          border: 1px solid #888888;

          p{
            color: #333333;
          }
        }
      }

      .sub-component-item{
        cursor: pointer;
        list-style-type: none;
        font-size: 14px;
        background-color: #f4f4f4;
        border: 1px solid #d8d8d8 !important;
        padding: 8px;
        width: 100%;
        margin-right: 4px;
        margin-bottom: 4px;
        text-align: center;
        transition: all 0.3s linear;

        i {
          margin: 0 5px;
          color: #514960;
          font-size: 28px;
        }
        p{
          display: inline-block;
          font-size: 12px;
          margin: 0px;
          padding: 0px;
          font-weight: 400px;
          color: #666666;
          width: 100%;
          font-weight: 300;
          text-align: center;
        }

        &:hover{
          border: 1px solid #888888;

          p{
            color: #333333;
          }
        }
      }
    }

    .sub-menu{
      width: 50%;
    }

    label, .label-bold label {
      font-family: 'Open Sans', Arial, serif;
      font-weight: bold !important;
      font-size: 13px !important;
      width: 100% !important;
    }

    select{
      border: 1px solid #dddddd;
      height: 41px;
      border-radius: 2px;
      font-family: 'Open Sans', Arial, serif;
      font-weight: 300;
    }

    textarea{
      box-shadow: none;
      height: 150px;

      &:focus{
        outline: 0;
      }
    }

    .tabs{
      display: table;
      width: 100%;
      border-bottom: 1px solid #DDDDDD;
      font-family: 'Open Sans', Arial, sans-serif;
      margin-bottom: 30px;

      ul{
        padding: 0px;
        list-style-type: none;

        li{
          float: left;

          a{
            display: inline-block;
            padding: 15px 0px;
            margin-right: 40px;
            color: #666666;
            font-weight: 300;
            opacity: 0.6;
            font-size: 16px;
            transition: all 0.3s linear;

            &:hover{
              opacity: 1;
              text-decoration: none;
            }
          }

        }

        li.is-active{
          a{
            border-bottom: 2px solid @stensul-purple;
            opacity: 1;
            text-decoration: none;
          }
        }
      }
    }
  }
</style>
