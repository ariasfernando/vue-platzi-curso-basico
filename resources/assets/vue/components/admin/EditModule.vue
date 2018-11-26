<template>
  <div class="col-xs-12 module">
    <module-header />
    <div class="row">
      <section v-if="ready" id="edit-container" class="col-xs-12 section-container">
        <column-bar-container side="left">
          <general-settings v-if="ready" />
          <elements-settings v-if="ready" />
        </column-bar-container>
        <!-- START: Module Container -->
        <div class="col-xs-8 module-container" @mouseup="clickModuleContainer">
          <scrollbar-container>
            <div v-if="showRaw" class="module-wrapper">
              <code-editor v-model="moduleRow" type="javascript" height="calc(100vh - 126px)" />
            </div>
            <div v-else class="module-wrapper" :class="`stx-${buildingMode}-mode`">
              <module />
            </div>
          </scrollbar-container>
        </div>
        <!-- END: Module Container -->
        <column-bar-container side="right">
          <module-settings v-if="showGeneralSettings" />
          <column-settings v-if="showColumnSettings" :current-component="currentComponent" />
          <component-settings v-if="showElementSettings" :current-component="currentComponent" />
        </column-bar-container>
      </section>
    </div>
    <spinner />
  </div>
</template>

<script>
import CodeEditor from './CodeEditor.vue';
import ColumnBarContainer from '../common/containers/ColumnBarContainer.vue';
import ColumnSettings from './partials/ColumnSettings.vue';
import ComponentSettings from './ComponentSettings.vue';
import ElementsSettings from './partials/ElementsSettings.vue';
import GeneralSettings from './partials/GeneralSettings.vue';
import Module from './Module.vue';
import ModuleHeader from './partials/ModuleHeader.vue';
import ModuleSettings from './partials/ModuleSettings.vue';
import ScrollbarContainer from '../common/containers/ScrollbarContainer.vue';
import Spinner from '../common/Spinner.vue';

export default {
  name: 'EditModule',
  components: {
    CodeEditor,
    ColumnBarContainer,
    ColumnSettings,
    ComponentSettings,
    ElementsSettings,
    GeneralSettings,
    Module,
    ModuleHeader,
    ModuleSettings,
    ScrollbarContainer,
    Spinner,
  },
  data() {
    return {
      ready: false,
    };
  },
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    moduleRow: {
      get() {
        return this.module;
      },
      set(values) {
        this.$store.commit('module/setModuleData', JSON.parse(values));
      },
    },
    currentComponent() {
      return this.$store.getters['module/currentComponent'];
    },
    buildingMode() {
      return this.$store.getters['module/buildingMode'];
    },
    showRaw() {
      return this.$store.getters['module/showRaw'];
    },
    showGeneralSettings() {
      return (
        this.ready &&
        this.currentComponent.columnId === undefined &&
        this.currentComponent.componentId === undefined
      );
    },
    showColumnSettings() {
      return (
        this.ready &&
        this.module.structure.columns.length > 1 &&
        this.currentComponent.columnId !== undefined &&
        this.currentComponent.componentId === undefined
      );
    },
    showElementSettings() {
      return (
        this.ready &&
        this.currentComponent.columnId >= 0 &&
        this.currentComponent.componentId >= 0
      );
    },
  },
  watch: {
    ready(value) {
      if (value === true) {
        setTimeout(() => {
          this.toggleSidebar();
          this.loadColumn();
        }, 100);
      }
    },
  },
  created() {
    this.loadModule();
  },
  methods: {
    loadColumn() {
      const numCols = this.module.structure.columns.length;

      if (numCols === 0) {
        this.$store.dispatch('module/addColumn');
      }
    },
    loadModule() {
      this.$store.commit('global/setLoader', true);
      const moduleId = this.$route.params.id || undefined;

      // TODO: Trigger event editModule.onInit
      this.$store
        .dispatch('module/getModuleData', moduleId)
        .then(() => {
          if (this.$route.path.match(/^\/clone\//)) {
            const cloned = Object.assign({}, this.module);
            cloned.moduleId = undefined;
            cloned.name = undefined;
            this.$store.commit('module/setModuleData', cloned);
          }

          // TODO: Trigger event editModule.onLoaded
          this.ready = true;
          this.$store.commit('global/setLoader', false);
        })
        .catch(() => {
          this.$root.$toast(
            "Oops! Something went wrong! Please try again. If it doesn't work, please contact our support team.", {
              className: 'et-error',
            });
        });
    },
    toggleSidebar() {
      const modOpen = document.getElementById('admin-module-container');
      modOpen.className -= 'col-xs-12';

      const sidebar = document.getElementById('admin-sidebar');
      sidebar.style.display = 'none';

      const container = document.getElementsByClassName('base-admin')[0];
      container.style.paddingLeft = 0;

      const sideToggled = document.getElementById('edit-container');
      sideToggled.classList.toggle('sidebar-closed');
    },
    clickModuleContainer(e) {
      if ($(e.target).hasClass('module-container')) {
        this.$store.commit('module/setCurrentComponent', {
          columnId: undefined,
          componentId: undefined,
        });
      }
    },
  },
};
</script>

<style lang="less">
@stensul-purple: #514960;
@stensul-white: #ffffff;
@stensul-gray: #666666;
@stensul-purple-light: lighten(@stensul-purple, 20%);
@focus: #78dcd6;
@focus-light: lighten(@focus, 30%);

@brand-primary: lighten(@stensul-purple, 35%);
@brand-secondary: @stensul-purple-light;

.el-input.is-active .el-input__inner,
.el-select .el-input__inner:focus,
.el-select .el-input.is-focus .el-input__inner,
.el-input__inner:focus {
  border-color: rgb(120, 220, 214);
}
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
    font-family: 'Open Sans', Arial, serif;
  }
}

#edit-container {
  padding: 0px;
  height: calc(~'100vh - 53px');
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
      @import '../../../less/base/commons/mobile/mobile_core_styles';
      @import '../../../less/base/commons/mobile/mobile_client_styles';
    }
  }

  .m-l-button {
    margin-left: 7px !important;
  }

  .beta-btn-primary {
    font-family: 'Open Sans', Arial, sans-serif;
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
    padding: 0px;
    background: #f0f0f0;
    display: block;
    float: left;
    height: calc(~'100vh - 53px');
    width: calc(~'100% - 540px');
    min-width: 640px;
    overflow-x: hidden;
    overflow-y: visible;
    table {
      border-collapse: initial;
    }
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

p,
ul,
ol {
  margin: 0;
  padding: 0;
}

#edit-container {
  .mce-content-body {
    line-height: inherit;
  }
}

#studio .column-bar-container {
  height: calc(100vh - 53px);
}
#studio .module-container .scrollbar-container-inner {
  padding: 20px 20px 100px;
}
</style>
