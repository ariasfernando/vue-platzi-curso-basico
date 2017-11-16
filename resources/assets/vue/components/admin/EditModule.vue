<template>
  <div class="col-xs-12 module">
    <module-header></module-header>

    <div class="row">
      <section v-if="ready" class="col-xs-12 section-container" id="edit-container">
        <!-- START: Left Bar -->
        <aside class="col-xs-2 left-bar">
            <div class="fields">
              <!-- START: General Settings -->
              <general-settings v-if="ready"></general-settings>

              <column-settings v-if="ready && module.structure.columns.length > 1 "></column-settings>

              <elements-settings v-if="ready"></elements-settings>
              <!-- END: Elements -->
            </div>
        </aside>
        <!-- END: Left Bar -->
        <!-- START: Module Container -->
        <div class="col-xs-8 module-container">
          <div v-if="showRaw" class="module-wrapper">
            <textarea v-html="module" @change="updateRawModule" rows="30" style="width: 100%"></textarea>
          </div>
          <div v-else class="module-wrapper" :class="buildingMode + '-mode'">
            <module></module>
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
  import ModuleHeader from './partials/ModuleHeader.vue'
  import GeneralSettings from './partials/GeneralSettings.vue';
  import ColumnSettings from './partials/ColumnSettings.vue';
  import ElementsSettings from './partials/ElementsSettings.vue';
  import ComponentSettings from './ComponentSettings.vue';
  import moduleService from '../../services/module';
  import Spinner from '../common/Spinner.vue';

  export default {
    name: 'EditModule',
    components: {
      Module,
      ModuleHeader,
      ColumnSettings,
      ElementsSettings,
      GeneralSettings,
      ComponentSettings,
      Spinner,
    },
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      buildingMode() {
        return this.$store.getters["module/buildingMode"];
      }
    },
    data () {
      return {
        showRaw: false,
        ready: false,
      }
    },
    watch:{
      ready(value){
        if (value === true){
          setTimeout(()=>{
            this.toggleSidebar();
            this.loadColumn();
          }, 100);
        }
      },
    },
    methods: {
      loadColumn(){
        let numCols = this.module.structure.columns.length;

        if (numCols === 0 ){
         this.$store.dispatch("module/addColumn");
        }
      },
      loadModule() {
        this.$store.commit("global/setLoader", true);
        const moduleId = this.$route.params.id || undefined;

        // TODO: Trigger event editModule.onInit
        this.$store.dispatch("module/getModuleData", moduleId)
          .then( response => {

            if (this.$route.path.match(/^\/clone\//)) {
              let cloned = Object.assign({}, this.module);
              cloned.moduleId = undefined;
              cloned.name = undefined;
              this.$store.commit("module/setModuleData", cloned);
            }

            // TODO: Trigger event editModule.onLoaded
            this.ready = true;
            this.$store.commit("global/setLoader", false);
          }).catch( error => {
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
      },
      toggleSidebar() {
        const modOpen = document.getElementById('admin-module-container');
        modOpen.className -= ('col-xs-12');

        const sidebar = document.getElementById('admin-sidebar');
        sidebar.style.display = 'none';

        const container = document.getElementsByClassName('base-admin')[0];
        container.style.paddingLeft = 0;
        
        const sideToggled = document.getElementById('edit-container');
        sideToggled.classList.toggle('sidebar-closed');
      }
    },
    created () {
      this.loadModule();
    }
  };
</script>

<style lang="less">
  @stensul-purple: #514960;
  @stensul-white: #FFFFFF;
  @stensul-purple-light: lighten(@stensul-purple, 20%);
  @focus: #78DCD6;
  @focus-light: lighten(@focus, 30%);


  @brand-primary: lighten(@stensul-purple, 35%);
  @brand-secondary: @stensul-purple-light;

  .fade.show {
    opacity: 1;
  }    

  .position-relative{
    position: relative;
  }
  .st-show-element{
    display: block!important;
  }

  .st-remove-sketch{
    top:30px!important;
    left:25px!important;
    z-index:500!important;
  }

  #studio{
    .section-container{
      font-family: 'Open Sans', Arial, serif;
    }
  }

  #edit-container{
    padding: 0px;
    height: calc(~"100vh - 53px"); 
    overflow: hidden;
    min-width: 1200px;
  }

  .module {
    margin-top: -15px;

    .module-wrapper {
      margin: 0 auto;

      &.desktop-mode {
        width: 640px;
      }
      &.mobile-mode {
        width: 480px;
      }
    }

    .m-l-button{
      margin-left: 7px!important;
    }

    .module-settings {

      h4{
        font-size: 13px;
        text-transform: uppercase;
        color: #666666;
        font-weight: 300;
        padding: 10px 10px;
        border-bottom: 1px solid #F0F0F0;
        margin: 0px -10px;
      }

      h5{
        font-size: 12px;
        text-transform: uppercase; 
        color: #666666;
        font-weight: 300;
        padding: 5px 0px 0px 0px;
      }

    }

    .component-settings{

      h4{
        font-size: 13px;
        text-transform: uppercase;
        color: #666666;
        font-weight: 300;
        padding: 10px 10px;
        border-bottom: 1px solid #D4D4D4;
        margin: 0px -10px 15px -10px;
      }

      .field-padding{
        padding-right: 15px;

        .col-sm-3{
          width: 70px;

          input{
            width: 37px;
          }
        }
      }

    }

    .header {
      color: @stensul-purple;
      background-color: #FFFFFF;
      height: 53px;
      padding: 17px 0;
      box-shadow: 0px 0px 4px #999999;
      margin-top: -3px;
      min-width: 1200px;


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
        height: 29px;
        width: 100px;
        background: @stensul-white;
        border-radius: 3px;
        margin: 0 auto;
        border: 1px solid #DFDFDF;
        margin-top: -3px;
      }

      .switch-label {
        position: relative;
        z-index: 2;
        float: left;
        width: 49px;
        line-height: 21px;
        font-size: 16px;
        color: @stensul-purple;
        text-align: center;
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
        -webkit-transition: 0.15s ease-out;
        -moz-transition: 0.15s ease-out;
        -o-transition: 0.15s ease-out;
        transition: 0.15s ease-out;
      }

      .switch-input:checked + .switch-label-on ~ .switch-selection {
        left: 50px;
      }

      .switch-selection {
        display: block;
        position: absolute;
        z-index: 1;
        top: 2px;
        left: 2px;
        width: 46px;
        height: 23px;
        border-radius: 2px;
        background: @stensul-purple;
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
        font-family: 'Open Sans', Arial, sans-serif;
        font-weight: 300;
        margin-top: -1px;
      }
    }

    .beta-btn-primary{
      font-family: 'Open Sans', Arial, sans-serif;
      font-size: 13px;
      margin-top: -6px;
      background: @stensul-purple;
      padding: 5px 7px;
      border: none;

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

    .section-container {
      background-color: #FFFFFF;
      padding-top: 0px;
      display: table;
      table-layout: fixed;
    }

    .left-bar {
      width: 260px;
      color: #666666;
      display: block;
      float: left;
      padding: 0px;
      background-color: #FFFFFF;

      button[aria-expanded="false"]{
       opacity: 0.5;
       transition: all 0.3s linear;

       &:hover{
        opacity: 1;
       }
      }

      li.ghost-component-menu{
        outline: 1px dashed @focus;
        
        &:before{
          content: '';
        }
      }

      button[aria-expanded="true"]{
       opacity: 1;

       p{
        font-weight: 600!important;
       }
       i{
          transform: rotate(180deg);
        }
      }

      .field-border{

        .row:nth-child(2){
          width: 28%;
        }
        .row:nth-child(3){
          width: 33%;
        }
        .row:nth-child(4){
          width: 33%;
        }

      }

      select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
      }

      label{
        text-align: left;
        color: #666666;
        padding-top: 2px;
        font-weight: 300;
        font-size: 13px;
        margin-bottom: 0px;
      }

      label.vue-js-switch{
        float: right;
      }

      .text-no-columns{
        font-size: 13px;
        font-weight: 300;
      }

      .tabs{
        margin-top: 15px;
      }

      .fields {
        span.is-danger{
          display: none!important;
        }

        .card-block .row{
          margin-bottom: 10px;

          .row{
            margin-bottom: 0px;
          }
        }

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
          padding: 15px 10px 13px 10px; 

          &:hover, &:visited,
          &:focus, &:active{
            color: #666666;
            outline: none;
          }
          p{
            font-size: 13px;
            margin: 0;
            padding: 0;
            font-weight: 300;

            i{
              color: #666666;
              vertical-align: baseline;
              transform: rotate(0deg);
              margin-right: 2px;
            }
          }
          i{
            color:#CCCCCC;
            line-height: 12px;
          }
        }
        
        #module-settings-left{
          .input-group-setting{
            margin-right: -12px !important;
          }
          .module-name{
            text-align: center;  
            input{
              font-size: 14px;
              padding: 15px 7px;
              margin-bottom: 10px;
              width: 90%;
              height: 40px;
            }
          }  
        }

        #column-settings{
          .input-group-setting{
            margin-right: -12px !important;
          }
        }

        #element{
          border-top: 1px solid #FFFFFF;
          margin-top: -1px;
        }

        #module-settings-left,
        #column-settings{
          border-top: 1px solid #FFFFFF;
          margin-top: -1px;

          input{
            text-align: left;
            border-radius: 2px;
            background: #f4f4f4;
            border: 0px;
            padding: 7px;
            height: 22px;
            font-size: 11px;
            color: #666666;
            
          }

          .card-header{
            padding-bottom: 20px;

            ul{
              margin-left: -10px;
              margin-right: -10px;
              border-bottom: 1px solid #DDDDDD;

              .nav-item{
                border-top: 1px solid #DDDDDD;
                border-left: 1px solid #DDDDDD;
                margin-bottom: -2px;

                &:first-child{
                  margin-left: 10px;
                }

                &:last-of-type{
                  border-right: 1px solid #DDDDDD;
                }
                .nav-link{
                  margin-right:0;
                  padding: 4px 7px;
                  border: 0;
                  border-radius:0;
                  font-weight: 300;
                  color: #666666;
                  &.active{
                    border-bottom: 2px solid @focus;
                    background: @focus-light;
                  }
                  &:focus{
                    background-color: transparent;
                  }
                  &:hover{
                    background-color:@focus-light;
                  }
                } 
              }
            }
          }
        }

        input:focus {
          outline: none;
          background: #e4e4e4;
        }

        .control {
          border-bottom: 1px solid #f0f0f0;
          padding: 15px 10px 15px 12px;
          display: table;

          .module-name{
            padding-bottom: 7px;
          }

          .row.field-undefined .col-sm-3{
            width: 67px;

            input{
              width: 100%;
            }
          }

          input[name="paddingTop"],
          input[name="paddingLeft"],
          input[name="paddingBottom"],
          input[name="paddingRight"]{
            width: 32px;
          }

          .field-paddingTop input,
          .field-paddingLeft input,
          .field-paddingBottom input,
          .field-paddingRight input{
            width: 100%;
          }

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

      .content-colorpicker{
        .sketch-picker{
          position: absolute!important;
          display: none;
          padding: 30px 10px 0px 10px;
          z-index: 300;
        }
        .icon-remove{
          color: #999999;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          margin-top: -20px;
          margin-left: -20px;
          padding-top: 4px;
        }
        .checkbox-transparent{
          position: absolute!important;
          display: none;
          left: 25px;
          top: 30px;
          width: 195px;
          z-index: 400;
          font-size: 11px;

          input{
            margin: 0!important;
            height: 19px!important;
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
          border: 1px solid #d8d8d8;
          padding: 20px 20px 14px 20px;
          width: 47%;
          margin-right: 4px;
          margin-bottom: 4px;
          float: left;
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

      .json-preview {
        margin-top: 25px;

        pre {
          font-size: 50px;
          font-family: Monaco;
        }
      }
    }

    .right-bar {
      width: 260px;
      display: block;
      float: left;
      padding: 0px;

      .field-border{

        .row:nth-child(2){
          width: 37%;
        }
        .row:nth-child(3){
          width: 23%;
        }
        .row:nth-child(4){
          width: 34%;
        }

      }

      .form-group{
        margin-bottom: 10px;
      }

      .card{
        padding: 15px 10px 15px 12px;
        border-bottom: 1px solid #f0f0f0;
        border-top: 1px solid #FFFFFF;
        margin-top: -1px;
        display: table;
        width: 100%;
      }

      select{
          height: 22px;
          font-size: 11px;
          color: #666666;
          border: none;
          background: #f4f4f4;
          box-shadow: none;
          font-weight: 300;
          width: 65px;
          float: right;
      }

      input[type=text]{
        height: 22px;
        background: #F4F4F4;
        border-radius: 2px;
        border: none;
        float: right;
        font-size: 11px;
        font-weight: 300;
        width: 65px;
      }

      input[name="href"]{
        width: 115px;
      }

      label{
        text-align: left;
        color: #666666;
        padding-top: 2px;
        font-weight: 300;
        padding-right: 0px;
      }

      .vue-js-switch{
        float: right;
        padding-top: 0px;
        margin: 0px;
      }

      .content-colorpicker{
        .sketch-picker{
          display: none;
          position: absolute!important;
          z-index: 300;
          right: 100%;
        }
        .icon-remove{
          color: #999999;
          background: #FFFFFF;
          border: 1px solid #CCCCCC;
          margin-top: -40px;
          margin-left: -35px;
          padding-top: 4px;
        }
      }
    }

    .module-container {
      padding: 20px;
      background: #F0F0F0;
      display: block;
      float: left;
      height: calc(~"100vh - 53px");
      width: calc(~"100% - 520px");
      min-width: 680px;
      overflow-x: hidden;
      overflow-y: visible;
    }

    .module-table {
      min-height: 100px;
    }

    .module-table .st-col, .right-bar {
      background-color: @stensul-white;
    }

    .is-danger {
      border: 1px solid red !important;
    }

  }

  .nopadding{
    padding: 0px;
  }

  .color-square{
    div{
      border: 1px solid #f4f4f4;
      height: 22px;
      width: 22px;
      position: absolute;
      margin-left: -20px;
      border-radius: 2px 0px 0px 2px;
    }
  }

</style>