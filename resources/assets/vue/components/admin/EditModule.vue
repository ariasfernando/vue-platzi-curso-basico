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
          <div v-else class="module-wrapper" :class="`stx-${buildingMode}-mode`">
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
import Module from "./Module.vue";
import ModuleHeader from "./partials/ModuleHeader.vue";
import GeneralSettings from "./partials/GeneralSettings.vue";
import ColumnSettings from "./partials/ColumnSettings.vue";
import ElementsSettings from "./partials/ElementsSettings.vue";
import ComponentSettings from "./ComponentSettings.vue";
import moduleService from "../../services/module";
import Spinner from "../common/Spinner.vue";

export default {
  name: "EditModule",
  components: {
    Module,
    ModuleHeader,
    ColumnSettings,
    ElementsSettings,
    GeneralSettings,
    ComponentSettings,
    Spinner
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
    },
    showRaw() {
      return this.$store.getters["module/showRaw"];
    }
  },
  data() {
    return {
      ready: false
    };
  },
  watch: {
    ready(value) {
      if (value === true) {
        setTimeout(() => {
          this.toggleSidebar();
          this.loadColumn();
        }, 100);
      }
    }
  },
  methods: {
    loadColumn() {
      let numCols = this.module.structure.columns.length;

      if (numCols === 0) {
        this.$store.dispatch("module/addColumn");
      }
    },
    loadModule() {
      this.$store.commit("global/setLoader", true);
      const moduleId = this.$route.params.id || undefined;

      // TODO: Trigger event editModule.onInit
      this.$store
        .dispatch("module/getModuleData", moduleId)
        .then(response => {
          if (this.$route.path.match(/^\/clone\//)) {
            let cloned = Object.assign({}, this.module);
            cloned.moduleId = undefined;
            cloned.name = undefined;
            this.$store.commit("module/setModuleData", cloned);
          }

          // TODO: Trigger event editModule.onLoaded
          this.ready = true;
          this.$store.commit("global/setLoader", false);
        })
        .catch(error => {
          this.$root.$toast(
            "Oops! Something went wrong! Please try again. If it doesn't work, please contact our support team.",
            { className: "et-error" }
          );
        });
    },
    toggleSidebar() {
      const modOpen = document.getElementById("admin-module-container");
      modOpen.className -= "col-xs-12";

      const sidebar = document.getElementById("admin-sidebar");
      sidebar.style.display = "none";

      const container = document.getElementsByClassName("base-admin")[0];
      container.style.paddingLeft = 0;

      const sideToggled = document.getElementById("edit-container");
      sideToggled.classList.toggle("sidebar-closed");
    },
    updateRawModule(e) {
      this.$store.commit("module/setModuleData", JSON.parse(e.target.value));
    }
  },
  created() {
    this.loadModule();
  }
};
</script>

<style lang="less">
@stensul-purple: #514960;
@stensul-white: #ffffff;
@stensul-purple-light: lighten(@stensul-purple, 20%);
@focus: #78dcd6;
@focus-light: lighten(@focus, 30%);

@brand-primary: lighten(@stensul-purple, 35%);
@brand-secondary: @stensul-purple-light;

.fade.show {
  opacity: 1;
}

.position-relative {
  position: relative;
}
.st-show-element {
  display: block !important;
}

.row-toggle {
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 15px;
}

.st-remove-sketch {
  top: 30px !important;
  left: 25px !important;
  z-index: 500 !important;
}

#studio {
  .section-container {
    font-family: "Open Sans", Arial, serif;
  }
}

#edit-container {
  padding: 0px;
  height: calc(~"100vh - 53px");
  overflow: hidden;
  min-width: 1200px;
}

.row-style-left {
  padding-bottom: 5px;
}

.module {
  margin-top: -15px;

  .module-wrapper {
    margin: 0 auto;

    &.stx-desktop-mode {
      width: 640px;

      .st-hide-desktop {
        display: none;
      }
    }
    &.stx-mobile-mode {
      width: 480px;
      // Mobile Classes
      @import "../../../less/base/commons/mobile/mobile_core_styles";
      @import "../../../less/base/commons/mobile/mobile_client_styles";
    }
  }

  .m-l-button {
    margin-left: 7px !important;
  }

  .beta-btn-primary {
    font-family: "Open Sans", Arial, sans-serif;
    font-size: 13px;
    margin-top: -6px;
    background: @stensul-purple;
    padding: 5px 7px;
    border: none;

    &:hover {
      border: none;
    }
  }

  .beta-btn-secondary {
    font-family: "Open Sans", Arial, sans-serif;
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

    a {
      color: #666666;

      &:hover {
        text-decoration: none;
      }
    }

    &:hover {
      background: @stensul-white;
      color: #666666;
      border: 1px solid @stensul-purple;
    }
  }

  .section-container {
    background-color: #ffffff;
    padding-top: 0px;
    display: table;
    table-layout: fixed;
  }
  .module-container {
    padding: 20px;
    background: #f0f0f0;
    display: block;
    float: left;
    height: calc(~"100vh - 53px");
    width: calc(~"100% - 540px");
    min-width: 640px;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .module-table {
    min-height: 100px;
  }

  .module-table .st-col,
  .right-bar {
    background-color: @stensul-white;
  }

  .is-danger {
    border: 1px solid red !important;
  }
}

.nopadding {
  padding: 0px;
}

.color-square {
  div {
    border: 1px solid #f4f4f4;
    height: 22px;
    width: 22px;
    position: absolute;
    margin-left: -20px;
    border-radius: 2px 0px 0px 2px;
  }
}

.mce-edit-focus {
  outline: none !important;
}

// New and refacted

#edit-container {
  .card-header {
    padding-bottom: 10px;
    ul {
      margin-left: -10px;
      margin-right: -10px;
      border-bottom: 1px solid #dddddd;

      .nav-item {
        border-top: 1px solid #dddddd;
        border-left: 1px solid #dddddd;
        margin-bottom: -2px;

        &:first-child {
          margin-left: 10px;
        }

        &:last-of-type {
          border-right: 1px solid #dddddd;
        }
        .nav-link {
          margin-right: 0;
          padding: 4px 7px;
          border: 0;
          border-radius: 0;
          font-weight: 300;
          color: #666666;
          &.active {
            border-bottom: 2px solid @focus;
            background: @focus-light;
          }
          &:focus {
            background-color: transparent;
          }
          &:hover {
            background-color: @focus-light;
          }
        }
      }
    }
  }
  .right-bar,
  .left-bar {
    height: calc(~"100vh - 55px");
    overflow: auto;
    width: 270px;
    display: block;
    float: left;
    padding: 0px;
    .btn.btn-secondary.btn-block {
      &:hover,
      &:visited,
      &:focus,
      &:active,
      &:active:focus {
        color: #666666;
      }
    }
    .fa.pull-left {
      margin-right: 12px;
    }

    .components-list {
      padding: 0;
      margin: 0;

      .component-item {
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
        p {
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

        &:hover {
          border: 1px solid #888888;

          p {
            color: #333333;
          }
        }
      }
    }

    .card {
      padding: 0 8px 15px 8px;
      border-bottom: 1px solid #f0f0f0;
      border-top: 1px solid #ffffff;
      margin-top: -1px;
      display: table;
      width: 100%;
    }

    select {
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

    select[multiple] {
      height: 50px;
    }

    input[name="href"] {
      width: 115px;
    }
    .vue-js-switch {
      float: right;
      padding-top: 0px;
      margin: 0px;
    }

    .content-colorpicker {
      .sketch-picker {
        display: none;
        position: absolute !important;
        z-index: 300;
        right: 100%;
      }
      .icon-remove {
        color: #999999;
        background: #ffffff;
        border: 1px solid #cccccc;
        margin-top: -40px;
        margin-left: -35px;
        padding-top: 4px;
      }
    }
  }
}
</style>