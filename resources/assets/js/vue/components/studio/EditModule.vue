<template>
  <div class="col-xs-12 module">
    <div class="row header">
      <div class="col-xs-3 header-col">
        <div class="col-xs-4 back vertical-center">
          <i class="glyphicon glyphicon-menu-left"></i>
          <router-link to="/">Back</router-link>
        </div>
        <div class="col-xs-8 section-title vertical-center">New Module</div>
      </div>

      <div class="col-xs-6 header-col">
        <div class="vertical-center">
          <div class="switch">
            <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
            <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="changeMode('desktop')">
              <i class="fa fa-desktop"></i>
            </label>
            <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
            <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="changeMode('device')">
              <i class="glyphicon glyphicon-phone"></i>
            </label>
            <span class="switch-selection"></span>
          </div>
        </div>
      </div>

      <div class="col-xs-3 header-col">
        <div class="vertical-center pull-right">
          <a class="btn btn-continue" href="#" @click.prevent="saveModule('draft')" :disabled="errors.any()">Save as draft<i class="glyphicon glyphicon-triangle-right"></i></a>
          <a class="btn btn-continue" href="#" @click.prevent="saveModule('publish')">Publish<i class="glyphicon glyphicon-triangle-right"></i></a>
        </div>
      </div>
    </div>

    <div class="row">
      <section v-if="ready" class="col-xs-12 section-container">

        <!-- START: Left Bar -->
        <aside class="col-xs-2 left-bar">
          <div class="module-settings">
            <h4>Module Settings</h4><hr>

            <div class="fields">

              <div class="control" :class="{'has-error': errors.has('name') }">
                <input v-model="module.name" v-validate.initial="'required'" :class="{'input': true, 'is-danger': errors.has('name') }"
                       name="name" type="text" placeholder="Module name">
              </div>

              <div class="control">
                <h5>Columns</h5> <hr>

                <ul class="list-inline">
                  <li :class="module.structure.columns.length == 1 ? 'selected' : ''" @click="setColumns(1)">1</li>
                  <li :class="module.structure.columns.length == 2 ? 'selected' : ''" @click="setColumns(2)">2</li>
                  <li :class="module.structure.columns.length == 3 ? 'selected' : ''" @click="setColumns(3)">3</li>
                  <li :class="module.structure.columns.length == 4 ? 'selected' : ''" @click="setColumns(4)">4</li>
                  <li :class="module.structure.columns.length == 5 ? 'selected' : ''" @click="setColumns(5)">5</li>
                </ul>
              </div>

              <div class="control">
                <h5>Elements</h5> <hr>

                <draggable :element="'ul'" 
                           :options="options"
                           width="100%"
                           class="components-list"
                >
                  <li class="component-item" data-type="text-element" @dragend="resetStyle">
                    <i class="glyphicon glyphicon-font"></i>
                    <p>Text</p>
                  </li>
                  <li class="component-item" data-type="image-element" @dragend="resetStyle">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>
                    <p>Image</p>
                  </li>
                  <li class="component-item" data-type="button-element" @dragend="resetStyle">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    <p>CTA</p>
                  </li>
                  <li class="component-item" data-type="divider-element" @dragend="resetStyle">
                    <i class="fa fa-minus-square-o" aria-hidden="true"></i>
                    <p>Divider</p>
                  </li>
                </draggable>  
              </div>
            </div>

          </div>
        </aside>
        <!-- END: Left Bar -->

        <!-- START: Module Container -->
        <div class="col-xs-7 module-container">
          <div class="col-xs-12">
            <module></module>
          </div>

          <div v-if="$route.query.debug" class="col-xs-12">
            <br><br>
            <pre>{{ module.structure.columns }}</pre>
          </div>
        </div>
        <!-- END: Module Container -->

        <!-- START: Right Bar -->
        <aside class="col-xs-3 right-bar">

          <div class="module-settings" v-if="currentComponent">
            <div class="fields">
              <component-settings></component-settings>
            </div>
          </div>

        </aside>
        <!-- END: Right Bar -->

      </section>
    </div>

    <spinner></spinner>
  </div>
</template>

<script>
  import Module from '../common/Module.vue'
  import ComponentSettings from './ComponentSettings.vue'
  import moduleService from '../../services/module'
  import Draggable from 'vuedraggable'
  import Spinner from '../common/Spinner.vue'

  export default {
    name: 'EditModule',
    computed: {
      module() {
        return this.$store.state.module.module;
      },
      currentComponent() {
        return this.$store.state.module.currentComponent;
      }
    },
    data () {
      return {
        ready: false,
        options: {
          group:{ 
            name:'componentsList',  
            pull: 'clone', 
            put: false, 
          },
          sort: false,
          ghostClass: "ghost-component-menu",  // Class name for the drop placeholder
          chosenClass: "chosen-component-menu",  // Class name for the chosen item
          dragClass: "drag-component-menu"  // Class name for the dragging item
        }
      }
    },
    components: {
      Module,
      ComponentSettings,
      Draggable,
      Spinner
    },
    methods: {
      loadModule() {
        this.$store.commit("global/setLoader", true);
        const moduleId = this.$route.params.id || undefined;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/getModuleData", moduleId)
          .then( response => {
            // TODO: Trigger event editModule.onLoaded
            this.ready = true;
            this.$store.commit("global/setLoader", false);
          }).catch( error => {
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
          });
      },
      saveModule(status) {
        this.$store.commit("global/setLoader", true);
        let data = this.module;
        data.status = status;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/saveModuleData", data)
          .then( response => {
            // TODO: Trigger event editModule.onLoaded
            if (!response) {
              this.$root.$toast('Error', {className: 'et-warn'});
              this.$store.commit("global/setLoader", false);
              return;
            }

            this.$store.commit("global/setLoader", false);
            this.$router.push('/');
          }).catch( error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-warn'});
          });
      },
      setColumns(cols) {
        let numCols = this.module.structure.columns.length;

        if ( numCols === cols ) {
          return true;
        }

        if ( numCols > cols ) {
          this.module.structure.columns.splice(cols - 1, numCols - cols);
        }

        if ( numCols < cols ) {
          for ( let i = numCols; i < cols; i++ ) {
            this.module.structure.columns.push({
              "style": {
              "verticalAlign": "middle",
              "textAlign": "center",
              "paddingTop": "10px",
              "paddingLeft": "10px",
              "paddingBottom": "10px",
              "paddingRight": "10px"
            },
            "components": []
            });
          }
        }

      },
      resetStyle(e) {
        e.target.style.opacity = "";
      },
      changeMode(mode) {
        this.$root.$toast('Mode has been changed to ' + mode, {className: 'et-info'});
      },
      preview() {
        this.$root.$toast('Preview event', {className: 'et-info'});
      },
      draft() {
        this.$root.$toast('Draft event', {className: 'et-info'});
      },
      publish() {
        this.$root.$toast('Publish event', {className: 'et-info'});
      },
      toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'none';

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = 0;
      }
    },
    created () {
      this.loadModule();
    },
    mounted () {
      this.toggleSidebar();
    }
  };
</script>

<style lang="less">
  @stensul-purple: #514960;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #69dac8;

  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .module {
    hr {
      border-top: 1px solid #ccc;
      margin: 0 0 10px 0;
    }

    .header {
      color: #FFFFFF;
      background-color: @stensul-purple;
      height: 60px;
      box-shadow: 0 8px 6px -6px #000;
      padding: 0;

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

    .left-bar {
      border-right: 1px solid #ccc;

      .fields {
        padding: 0 10px;

        .is-danger {
          font-size: 12px;
          padding-top: 5px;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 3pt 2pt @focus;
        }

        .control {
          margin-top: 20px
        }

        .list-inline {
          text-align: center;
        }

        .list-inline li {
          border: 1px solid #ccc;
          padding: 5px 10px;
          cursor: pointer;

          &.selected {
            border: 1px solid @focus;
          }
        }
      }

      .components-list {
        padding: 0;
        text-align: center;

        .component-item {
          list-style-type: none;
          width: 46%;
          font-size: 22px;
          text-align: center;
          background-color: #f4f4f4;
          border: 1px solid #ccc;
          margin: 2px 0;
          padding: 5px;
          cursor: pointer;
          display: inline-block;
          height: 60px;

          i {
            margin: 0 5px;
          }

          p{
            font-size: 14px;
            margin: 0px;
            padding: 0px;
          }
        }
      }

      .json-preview {
        margin-top: 25px;

        pre {
          font-size: 50px;
          font-family: Monaco;
        }
      }
    }

    .right-bar {
      border-left: 1px solid #ccc;
    }

    .module-container {

    }

    .module-table {
      min-height: 100px;
    }

    .module-table .st-col {
      background-color: #f4f4f4;
    }

    .is-danger {
      border: 1px solid red !important;
    }
  }

</style>