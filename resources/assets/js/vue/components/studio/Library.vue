<template>
  <section class="col-xs-12">

    <div class="modal-mpf-content-data simple-text-config admin-library-form">
      <h1>{{ library.name }}</h1>

      <form id="edit-library" action="/admin/library/edit" method="POST" v-if="ready" @submit.prevent="saveLibrary">


        <div class="row">
          <!-- Field Name -->
          <div class="col-md-6">
            <label for="name">Name</label>
            <p :class="{ 'control': true }">
              <input v-model="library.name" v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('name') }" name="name" type="text"
                     placeholder="Enter name here.">
              <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
          </div>

          <!-- Field Description -->
          <div class="col-md-6">
            <label for="description">Description</label>
            <p :class="{ 'control': true }">
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
            <p :class="{ 'control': true }">
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
            <p :class="{ 'control': true }">
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
            <p :class="{ 'control': true }">
              <input v-model="library.config.templateBackgroundColor" v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('templateBackgroundColor') }"
                     name="templateBackgroundColor" type="text" placeholder="#FFFFFF">
              <span v-show="errors.has('templateBackgroundColor')"
                    class="help is-danger">{{ errors.first('templateBackgroundColor') }}</span>
            </p>
          </div>
        </div>

        <div class="row">
          <!-- Field font-family -->
          <div class="col-md-6">
            <label for="fontFamily">Font Family</label>
            <p :class="{ 'control': true }">
              <input v-model="library.config.fontFamily" v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('fontFamily') }" name="fontFamily" type="text"
                     placeholder="Arial, sans-serif">
              <span v-show="errors.has('fontFamily')" class="help is-danger">{{ errors.first('fontFamily') }}</span>
            </p>
          </div>

          <!-- Field font-color -->
          <div class="col-md-6">
            <label for="fontColor">Font Color</label>
            <p :class="{ 'control': true }">
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
            <p :class="{ 'control': true }">
              <input v-model="library.config.fontSize" v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('fontSize') }" name="fontSize" type="text"
                     placeholder="12">
              <span v-show="errors.has('fontSize')" class="help is-danger">{{ errors.first('fontSize') }}</span>
            </p>
          </div>

          <!-- Field line-height -->
          <div class="col-md-6">
            <label for="lineHeight">Line Height</label>
            <p :class="{ 'control': true }">
              <input v-model="library.config.lineHeight" v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('lineHeight') }" name="lineHeight" type="text"
                     placeholder="14">
              <span v-show="errors.has('lineHeight')" class="help is-danger">{{ errors.first('lineHeight') }}</span>
            </p>
          </div>
        </div>

        <!-- Select modules -->
        <div class="row">
          <div class="col-md-12">
            <hr/>
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

                  <select :name="'modules[' + idx + '][modules]'" class="form-control" multiple>
                    <option v-for="module in modules" :value="module" :selected="group.modules.indexOf(module) >= 0">
                      {{ module }}
                    </option>
                  </select>

                  <div v-if="group.name == 'default'" class="sep">
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
            <button type="submit" class="btn btn-success pull-right submit-config" :disabled="errors.any()">Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>

</template>

<script>
  import libraryService from '../../services/library'

  export default {
    name: 'Library',
    data: function () {
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
          config: this.library.config
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
    created: function () {
      this.loadLibrary();
    }
  };
</script>

<style>
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
</style>