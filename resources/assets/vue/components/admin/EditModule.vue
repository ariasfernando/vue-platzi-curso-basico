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
            <div class="fields">
              <!-- START: General Settings -->
              <b-btn block v-b-toggle.general-settings class="module-settings-item">
                <i class="fa fa-cogs pull-left"></i>
                <p class="pull-left">General Settings</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>
             
              <b-collapse id="general-settings" accordion="module-setting-accordion">
                <b-card class="control" 
                        :class="{'has-error': errors.has('name') }">
                  <input :value="module.name" 
                         :class="{'input': true, 'is-danger': errors.has('name') }"
                         class="module-name"
                         v-validate.initial="'required'" 
                         name="name" 
                         type="text" 
                         placeholder="Module name" 
                         @input="updateName">
                </b-card>
              </b-collapse>
              <!-- END: General Settings -->
              <!-- START: Module Settings -->
              <b-btn block v-b-toggle.module-setting class="module-settings-item">
                <i class="fa fa-cogs pull-left"></i>
                <p class="pull-left">Module Settings</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>
              
              <b-collapse id="module-setting" accordion="module-setting-accordion">
                <b-card class="control">
                  <p>Columns</p> 
                  <ul class="list-inline">
                    <li v-for="n in maxCols" :class="module.structure.columns.length === n ? 'selected' : ''" @click="setColumns(n)">{{ n }}</li>
                  </ul>
                </b-card>
              </b-collapse>
              <!-- END: Module Settings -->
              <!-- START: Elements -->
              <b-btn block v-b-toggle.element class="module-settings-item">
                <i class="fa fa-th-large pull-left" variant=""></i>
                <p class="pull-left">Elements</p>
                <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
              </b-btn>

              <b-collapse id="element" accordion="module-setting-accordion">
                <b-card class="control">
                  <draggable :element="'ul'" 
                             :options="options"
                             width="100%"
                             class="components-list"
                  >
                    <li class="component-item" data-type="text-element">
                      <i class="fa fa-align-justify"></i>
                      <p>Text</p>
                    </li>
                    <li class="component-item" data-type="image-element">
                      <i class="fa fa-picture-o" aria-hidden="true"></i>
                      <p>Image</p>
                    </li>
                    <li class="component-item" data-type="button-element">
                      <i class="fa fa-square" aria-hidden="true"></i>
                      <p>CTA</p>
                    </li>
                    <li class="component-item" data-type="divider-element">
                      <i class="fa fa-minus-square" aria-hidden="true"></i>
                      <p>Divider</p>
                    </li>
                  </draggable>  
                </b-card>
              </b-collapse>
              <!-- END: Elements -->
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
  import Module from './Module.vue';
  import ComponentSettings from './ComponentSettings.vue';
  import moduleService from '../../services/module';
  import Draggable from 'vuedraggable';
  import BootstrapVue from 'bootstrap-vue';
  import Spinner from '../common/Spinner.vue';
  import _ from 'lodash';

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
        maxCols: 5,
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
      BootstrapVue,
      Spinner
    },
    methods: {
      updateName(e) {
        this.setModuleField({ name: e.target.value });
      },
      setModuleField(data) {
        this.$store.commit("module/setModuleFields", data);
      },
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
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
      },
      saveModule(status) {
        this.$store.commit("global/setLoader", true);
        this.setModuleField({ status });

        let data = this.module;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/saveModuleData", data)
          .then( response => {
            // TODO: Trigger event editModule.onLoaded
            if (!response) {
              this.$root.$toast('Error', {className: 'et-error'});
              this.$store.commit("global/setLoader", false);
              return;
            }

            this.$store.commit("global/setLoader", false);
            if (this.module.status === 'publish') {
              this.$router.push('/');
            }
            this.$root.$toast('Module Saved', {className: 'et-success'});
          }).catch( error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast('Got nothing from server. Prompt user to check internet connection and try again', {className: 'et-error'});
          });
      },
      setColumns(cols) {
        let numCols = this.module.structure.columns.length;

        if ( numCols === cols ) {
          return true;
        }

        if ( numCols > cols ) {
          this.$store.commit("module/removeColumns", {
            index: cols -1,
            number: numCols - cols
          });
        }

        if ( numCols < cols ) {
          for ( let i = numCols; i < cols; i++ ) {
            this.$store.commit("module/addColumn");
          }
        }
      },
      changeMode(mode) {
        this.$root.$toast('Mode has been changed to ' + mode, {className: 'et-info'});
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
      background-color: #F0F0F0;
      padding: 0;
    }

    .left-bar {
      background-color: #FFFFFF;
      padding: 0;
      color: #666666;

      .fields {
        .fa.pull-left{
          margin-right: 12px; 
        }
        button.module-settings-item{
          line-height: 13px;
          box-shadow: none;
          border-bottom: 1px solid #F0F0F0;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          padding: 11px 9px 12px 11px; 
          &:hover, &:visited,
          &:focus, &:active{
            color: #666666;
            outline: none;
          }
          p{
            font-size: 14px;
            margin: 0;
            padding: 0;
          }
          i.pull-right{
            color:#CCCCCC;
          }
          &[aria-expanded="true"]{
            background-color: #F0F0F0;
          }
        }
        
        #general-settings{
          input.module-name{
            font-size: 12px;
            padding: 7px;
          }
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 3pt 2pt @focus;
        }

        .control {
          border-bottom: 1px solid #f0f0f0;
          padding: 15px 10px 15px 12px;
        }

        .list-inline{
          padding: 0;
          margin:0;

          li {
            border: 1px solid #ccc;
            padding: 2px 24px;
            cursor: pointer;

            &.selected {
              border: 1px solid @focus;
            }
          }
        } 
      }

      .components-list {
        padding: 0;
        margin: 0;

        .component-item{
          cursor: pointer;
          list-style-type: none;
          font-size: 14px;
          background-color: #f4f4f4;
          border-top: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-bottom: 0;
          padding: 5px;
          &:last-of-type{
            border: 1px solid #ccc;
          }
          i {
            margin: 0 5px;
          }
          p{
            display: inline-block;
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

    .module-table {
      min-height: 100px;
    }

    .module-table .st-col, .right-bar {
      background-color: #FFFFFF;
    }

    .is-danger {
      border: 1px solid red !important;
    }
  }

</style>