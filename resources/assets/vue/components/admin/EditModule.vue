<template>
  <div class="col-xs-12 module">
    <ModuleHeader />
    <div v-if="ready" class="row">
      <section id="edit-container" class="col-xs-12 section-container">
        <ColumnBarContainer side="left">
          <GeneralSettings v-if="ready" />
          <ElementsSettings v-if="ready" />
        </ColumnBarContainer>
        <!-- START: Module Container -->
        <div class="col-xs-8 module-container" @mouseup="clickModuleContainer">
          <ScrollbarContainer>
            <CodeEditor v-if="showRaw" v-model="raw" height="calc(100vh - 135px)" />
            <ModuleContainer v-else :building-mode="buildingMode" :width-desktop="640" :width-mobile="480">
              <Module :module="module" />
            </ModuleContainer>
          </ScrollbarContainer>
        </div>
        <!-- END: Module Container -->
        <ColumnBarContainer side="right">
          <ModuleSettings v-if="!currentElementId" />
          <ColumnSettings v-if="currentElement.type === 'column-element'" />
          <RowSettings v-if="currentElement.type === 'row-element'" />
          <ComponentSettings v-if="currentElementId && currentElement.type !== 'row-element' && currentElement.type !== 'column-element'" />
        </ColumnBarContainer>
      </section>
    </div>
    <div v-else class="container-spinner">
      <StuiSpinner />
    </div>
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
import ModuleContainer from '../common/containers/ModuleContainer.vue';
import ModuleHeader from './partials/ModuleHeader.vue';
import ModuleSettings from './partials/ModuleSettings.vue';
import RowSettings from './partials/RowSettings.vue';
import ScrollbarContainer from '../common/containers/ScrollbarContainer.vue';

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
    ModuleContainer,
    ModuleHeader,
    ModuleSettings,
    RowSettings,
    ScrollbarContainer,
  },
  data() {
    return {
      ready: false,
      timer: null,
    };
  },
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    currentElementId() {
      return this.$store.getters['module/currentElementId'];
    },
    raw: {
      get() {
        return this.currentElement;
      },
      set(value) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          const validJson = Application.utils.isJsonString(value);
          if (validJson) {
            const data = {
              elementId: this.currentElementId,
              value: JSON.parse(value),
            };
            this.$store.commit('module/setElementData', data);
            this.$root.$toast('Raw updated', {
              className: 'et-success',
            });
          } else {
            this.$root.$toast('Couldn\'t update. Raw isn\'t a valid JSON format', {
              className: 'et-error',
            });
          }
        }, 500);
      },
    },
    buildingMode() {
      return this.$store.getters['module/buildingMode'];
    },
    showRaw() {
      return this.$store.getters['module/showRaw'];
    },
    currentElement() {
      return this.getElement(this.currentElementId);
    },
  },
  watch: {
    ready(value) {
      if (value === true) {
        setTimeout(() => {
          this.loadColumn();
        }, 100);
      }
    },
  },
  created() {
    this.loadModule();
    this.toggleSidebar();
  },
  methods: {
    loadColumn() {
      _.forEach(this.module.structure.rows, (row)=>{
        const numCols = row.columns.length
        if (numCols === 0) {
          this.$store.dispatch('module/addColumn',{row: this.row.id});
        }
      });
    },
    loadModule() {
      this.$store.commit('global/setLoader', true);
      this.$store.commit('module/setCurrentElementId', false);
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
          } else if (this.module.inUse) {
            this.$root.$toast(
              'This module is already in use. Any changes will not affect or update the module instance in ' +
                'the existing campaigns. To create a new version you can clone the module in the module list.',
              {
                className: 'et-info',
                closeable: true,
                duration: 10000,
              },
            );
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
      const sidebar = document.getElementById('admin-sidebar');
      sidebar.style.display = 'none';

      const container = document.getElementsByClassName('base-admin')[0];
      container.style.paddingLeft = 0;
    },
    clickModuleContainer(e) {
      if (
        $(e.target).hasClass('scrollbar-container-inner') ||
        $(e.target).hasClass('mCustomScrollBox')
      ) {
        this.$store.commit('module/setCurrentElementId', false);
      }
    },
    getElement(elementId) {
      if(!elementId){
        return this.module;
      }
      let element = false;
      _.forEach(this.module.structure.rows, (row) => {
        if (row.id === elementId) {
          element = row;
          return false;
        }
        _.forEach(row.columns, (column) => {
          if (column.id === elementId) {
            element = column;
            return false;
          }
          _.forEach(column.components, (CurrentComponent) => {
            if (CurrentComponent.id === elementId) {
              element = CurrentComponent;
              return false;
            }
            return true;
          });
          return !element;
        });
        return !element;
      });
      return element;
    },
  },
};
</script>

<style lang="scss" scoped>
.module /deep/ {
  .mCSB_outside {
    overflow: unset;
    .mCSB_container {
      overflow: unset;
    }
  }
}
.container-spinner {
  height: calc(100vh - 102px);
  /deep/ .spinner-wrapper {
    top: 50%;
  }
}
</style>
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
  height: calc(~'100vh - 102px');
  overflow: hidden;
  min-width: 1200px;
  padding-top: 46px;
}

.row-style-left {
  padding-bottom: 5px;
}

.module {
  margin-top: -15px;

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
    height: calc(~'100vh - 102px');
    width: calc(~'100% - 540px');
    min-width: 640px;
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

#edit-container {
  .mce-content-body {
    line-height: inherit;
  }
}

#studio .column-bar-container {
  height: calc(~'100vh - 102px');
}
#studio .module-container .scrollbar-container-inner {
  padding: 15px 15px 0 15px;
  .module-wrapper-width {
    padding-bottom: 100px;
    padding-top: 25px;
  }
}
</style>
