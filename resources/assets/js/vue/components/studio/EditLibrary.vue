<template>
  <div class="col-xs-12 library">
    <div class="row header">
      <div class="col-xs-10 header-col">
        <div class="col-xs-1 back vertical-center">
          <i class="glyphicon glyphicon-menu-left"></i>
          <router-link to="/">Back</router-link>
        </div>
        <div class="col-xs-11 section-title vertical-center">{{ library.id ? 'Edit' : 'New' }} Library</div>
      </div>

      <div class="col-xs-2 header-col">
        <div class="vertical-center">
          <a class="btn btn-continue" href="#" @click.prevent="saveLibrary" :disabled="errors.any()">Submit<i class="glyphicon glyphicon-triangle-right"></i></a>
        </div>
      </div>
    </div>

    <div class="row">
      <section v-if="ready" class="col-xs-12 section-container">
        <div class="simple-text-config admin-library-form">

          <form id="edit-library" action="/admin/library/edit" method="POST" @submit.prevent="saveLibrary">

            <h4>General Settings</h4><hr>
            <div class="row">
              <!-- Field Name -->
              <div class="col-md-6">
                <label for="name">Name</label>
                <p class="control">
                  <input v-model="library.name" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('name') }" name="name" type="text"
                         placeholder="Enter name here.">
                  <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                </p>
              </div>

              <!-- Field Description -->
              <div class="col-md-6">
                <label for="description">Description</label>
                <p class="control">
                  <input v-model="library.description" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('name') }" name="description" type="text"
                         placeholder="Enter description here.">
                  <span v-show="errors.has('description')" class="help is-danger">{{ errors.first('description') }}</span>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field width -->
              <div class="col-md-6">
                <label for="templateWidth">Template width</label>
                <p class="control">
                  <input v-model="library.config.templateWidth" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('templateWidth') }" name="templateWidth"
                         type="text" placeholder="660">
                  <span v-show="errors.has('templateWidth')" class="help is-danger">{{ errors.first('templateWidth')
                    }}</span>
                </p>
              </div>

              <!-- Field mobile-width -->
              <div class="col-md-6">
                <label for="templateMobileWidth">Template Mobile Width</label>
                <p class="control">
                  <input v-model="library.config.templateMobileWidth" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('templateMobileWidth') }"
                         name="templateMobileWidth" type="text" placeholder="480">
                  <span v-show="errors.has('templateMobileWidth')"
                        class="help is-danger">{{ errors.first('templateMobileWidth') }}</span>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field background-color -->
              <div class="col-md-6">
                <label for="templateBackgroundColor">Template Background Color</label>
                <p class="control">
                  <input v-model="library.config.templateBackgroundColor" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('templateBackgroundColor') }"
                         name="templateBackgroundColor" type="text" placeholder="#FFFFFF">
                  <span v-show="errors.has('templateBackgroundColor')"
                        class="help is-danger">{{ errors.first('templateBackgroundColor') }}</span>
                </p>
              </div>

              <!-- Field content-background-color -->
              <div class="col-md-6">
                <label for="contentBackgroundColor">Content Background Color</label>
                <p class="control">
                  <input v-model="library.config.contentBackgroundColor" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('contentBackgroundColor') }"
                         name="contentBackgroundColor" type="text" placeholder="#FFFFFF">
                  <span v-show="errors.has('contentBackgroundColor')"
                        class="help is-danger">{{ errors.first('contentBackgroundColor') }}</span>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field font-family -->
              <div class="col-md-6">
                <label for="fontFamily">Font Family</label>
                <p class="control">
                  <input v-model="library.config.fontFamily" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('fontFamily') }" name="fontFamily" type="text"
                         placeholder="Arial, sans-serif">
                  <span v-show="errors.has('fontFamily')" class="help is-danger">{{ errors.first('fontFamily') }}</span>
                </p>
              </div>

              <!-- Field font-color -->
              <div class="col-md-6">
                <label for="fontColor">Font Color</label>
                <p class="control">
                  <input v-model="library.config.fontColor" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('fontColor') }" name="fontColor" type="text"
                         placeholder="#000000">
                  <span v-show="errors.has('fontColor')" class="help is-danger">{{ errors.first('fontColor') }}</span>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field font-size -->
              <div class="col-md-6">
                <label for="fontSize">Font Size</label>
                <p class="control">
                  <input v-model="library.config.fontSize" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('fontSize') }" name="fontSize" type="text"
                         placeholder="12">
                  <span v-show="errors.has('fontSize')" class="help is-danger">{{ errors.first('fontSize') }}</span>
                </p>
              </div>

              <!-- Field line-height -->
              <div class="col-md-6">
                <label for="lineHeight">Line Height</label>
                <p class="control">
                  <input v-model="library.config.lineHeight" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('lineHeight') }" name="lineHeight" type="text"
                         placeholder="14">
                  <span v-show="errors.has('lineHeight')" class="help is-danger">{{ errors.first('lineHeight') }}</span>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field background-color -->
              <div class="col-md-6">
                <label for="linkColor">Link Color</label>
                <p class="control">
                  <input v-model="library.config.linkColor" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('linkColor') }"
                         name="linkColor" type="text" placeholder="#FFFFFF">
                  <span v-show="errors.has('linkColor')"
                        class="help is-danger">{{ errors.first('linkColor') }}</span>
                </p>
              </div>

              <!-- Field content-background-color -->
              <div class="col-md-6">
                <label for="linkDecoration">Link Decoration</label>
                <p class="control">
                  <select v-model="library.config.linkDecoration">
                    <option>none</option>
                    <option>underline</option>
                  </select>
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field background-color -->
              <div class="col-md-12">
                <label for="externalCssLink">External CSS Link</label>
                <p class="control">
                  <input v-model="library.config.externalCssLink" name="linkColor" type="text" placeholder="http://www.example.com/css/styles.css">
                </p>
              </div>
            </div>

            <div class="row">
              <!-- Field content-background-color -->
              <div class="col-md-12">
                <label for="propietaryCss">Propietary Styles</label>
                <p class="control">
                  <textarea v-model="library.config.propietaryCss" rows="10" name="propietaryCss" type="text" placeholder=""></textarea>
                </p>
              </div>
            </div>

            <h4>Modules</h4>
            <!-- Select modules -->
            <div class="row">
              <div class="col-md-12">
                <br/>
                <div id="modules-container">

                  <div v-for="(group, idx) in library.modules" :id="'modules-' + group.name">

                    <div :id="'group-container-' + group.name">

                      <label for="fontFamily">Group Name</label>
                      <p :class="{ 'control': true }">
                        <input v-model="group.name" v-validate="'required'"
                               :class="{'input': true, 'is-danger': errors.has('groupName-' + idx) }"
                               :name="'modules[' + idx + '][name]'" type="text" placeholder="Enter group name">
                        <span v-show="errors.has('groupName-' + idx)"
                              class="help is-danger">{{ errors.first('groupName-' + idx) }}</span>
                      </p>

                      <select v-model="group.modules" :name="'modules[' + idx + '][modules]'" class="form-control" multiple>
                        <option v-for="module in modules" :value="module" :selected="group.modules.indexOf(module) >= 0">
                          {{ module }}
                        </option>
                      </select>

                      <div v-if="group.name === 'default'" class="sep">
                        <br/><br/>
                      </div>

                      <div v-else class="group-remove-container">
                        <span class="glyphicon glyphicon-trash group-remove" @click.prevent="deleteGroup(idx)"></span>
                        <hr/>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <button class="btn btn-success center-block btn-add-group" @click.prevent="addGroup">Add Group</button>
                <br>
              </div>
            </div>

            <!-- Input submit  -->
            <div class="row">
              <div class="col-md-12">
                <button type="submit" class="btn btn-success pull-right submit-config hidden" :disabled="errors.any()">Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>


  </div>

</template>

<script>
  import libraryService from '../../services/library'

  export default {
    name: 'EditLibrary',
    data () {
      return {
        library: {},
        modules: {},
        ready: false
      }
    },
    methods: {
      loadLibrary() {
        let libraryId = this.$route.params.id;

        if (libraryId) {
          libraryService.getLibrary(libraryId)
            .then((response) => {
              this.library = response.library;
              this.modules = response.modules;
              this.ready = true;
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
            });
        } else {
          libraryService.newLibrary()
            .then((response) => {
              this.library = response.library;
              this.modules = response.modules;
              this.ready = true;
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
            });
        }
      },
      saveLibrary(event) {

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
                window.location.href = "/admin/library";
              }
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
            });
        } else {
          libraryService.createLibrary(formData)
            .then((response) => {
              if (response.message === 'SUCCESS') {
                window.location.href = "/admin/library";
              }
            })
            .catch((error) => {
              this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
            });
        }
      },
      addGroup() {
        this.temporal = this.temporal || 1;
        let tmpName = 'Unnamed Group ' + this.temporal++;

        this.library.modules.push({
          name: tmpName,
          modules: []
        });
      },
      deleteGroup(idx) {
        this.library.modules.splice(idx, 1);
      }
    },
    created () {
      this.loadLibrary();
    }
  };
</script>

<style lang="less">
  @stensul-purple: #514960;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #69dac8;

  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .library {

    .header {
      color: #FFFFFF;
      background-color: @stensul-purple;
      height: 80px;
      box-shadow: 0 8px 6px -6px #000;
      margin-bottom: 20px;
      padding: 15px 0;

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

      .back {
        border-right: 1px solid #FFFFFF;

        i {
          font-size: 24px;
          margin-right: 5px;
        }

        a {
          color: #FFFFFF;
        }
      }

      .section-title {
        font-size: 18px;
      }

      .btn {
        margin: 5px;
      }
    }

    .section-container {
      background-color: #FFFFFF;
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
      text-align: right;
    }

    .group-remove {
      float: none !important;
      margin-top: 10px;
    }

    .is-danger {
      color: red;
    }
  }
</style>