<template>
  <div class="expand st-module-menu-wrapper">
    <label-item-container label="MODULES" icon="glyphicon-th-large" v-b-toggle.modules></label-item-container>
      <b-collapse id="modules" visible class="card">
        <div v-if="ready" v-for="item in items">
          <div v-if="item.sub_menu" class="expand">
              <div class="beta-submodules">
                <div v-for="subitem in item.sub_menu">
                  <draggable :element="'div'" :options="options" @clone="onClone" @end="onEnd">
                    <div class="add single">
                      <h2 class="draggable-item" @click="addModuleByName(subitem.name, 'subitem')" :module-id="subitem.name" :module-type="'subitem'">
                        {{ subitem.name }} <i class="glyphicon glyphicon-plus"></i>
                      </h2>
                    </div>
                  </draggable>
                </div>
              </div>
          </div>
          <draggable v-else :element="'div'" :options="options" @clone="onClone" @end="onEnd">
            <group-container @click="addModuleByName(item.name, 'item')" :clickeable="true">
              <settings-container :label="item.name" customClass="draggable-item" :module-id="item.name" :module-type="'item'" >
                <template slot="setting-right">
                  <i class="glyphicon glyphicon-plus icon-plus" style="float: right;"></i>
                </template>
              </settings-container>
            </group-container>
          </draggable>

        </div>
    </b-collapse>

  </div>
</template>

<script>

  import clone from 'clone';
  import _ from 'lodash';
  import Draggable from 'vuedraggable';
  import ModuleListMixin from './mixins/moduleListMixin';
  import LabelItemContainer from "../common/containers/LabelItemContainer.vue";
  import GroupContainer from "../common/containers/GroupContainer.vue";
  import SettingsContainer from "../common/settings/containers/SettingsContainer.vue";

  export default {
    name: 'CampaignMenu',
    components: {
      Draggable,
      LabelItemContainer,
      GroupContainer,
      SettingsContainer,
    },
    props: {
      libraryId: {
        type: String,
        required: true
      }
    },
    mixins: [ ModuleListMixin ],
    data () {
      return {
        options: {
          group:{
            name: 'componentsEmailCanvas',
            pull: 'clone',
            put: false,
          },
          sort: false,
          forceFallback: (/Edge/.test(navigator.userAgent)) ? true : false,
          // Class name for the drop placeholder
          ghostClass: "ghost-component",
          // Class name for the chosen item
          chosenClass: "chosen-component",
          // Class name for the dragging item
          dragClass: "drag-component"
        },
        expanded: [],
        collapsed: false,
        isActive: false,
        ready: false,
      }
    },
    computed: {
      campaign () {
        return this.$store.getters["campaign/campaign"];
      },
      items () {
        return this.$store.getters["library/modules"];
      },
      activeModule() {
        const activeModuleId = this.$store.getters["campaign/activeModule"];
        return this.modules[activeModuleId] || undefined;
      }
    },
    created() {
      // Set defaults for modules from menu
      this.getLibrary().then(response => {

        // Sanitize library's modules
        _.each(this.items, (item) => {
          if (item.sub_menu) {
            // Items representing a menu group
            this.expanded[item.name] = false;

            // Grouped modules in library menu
            _.each(item.sub_menu, (item) => {
              this.setModuleFixedStatus(item);
            });
          }
          else {
            // First level modules in library menu
            this.setModuleFixedStatus(item);
          }
        });

        // Sanitize campaign's modules
        _.each(this.modules, (item) => {
          this.setModuleFixedStatus(item);
        });

        this.ready = true;
      }, error => {
        this.$store.commit("global/setLoader", false);
        this.$root.$toast(
          'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
          {
            className: 'et-error'
          }
        );
      });

    },
    methods: {
      getLibrary () {
        return this.$store.dispatch("library/getModulesData", this.libraryId);
      },
      addModuleByName (moduleName, moduleType) {
        const found = this.findModule(moduleName, moduleType);
        const mod = clone(found);

        this.addModule(mod);
      },
      expand (event, item) {
        const index = this.expanded.indexOf(item);
        if (index !== -1) {
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item);
        }

        if(event.target.className === "menu-active" || event.target.parentElement.className === "menu-active") {
          if (event.target.tagName === 'I'){
            event.target.parentElement.className = "selected";
            event.target.parentElement.nextElementSibling.className += " beta-submodules-expanded";
          }else{
            event.target.className = "selected";
            event.target.nextElementSibling.className += " beta-submodules-expanded";
          }
        } else{
          if (event.target.tagName === 'I'){
            event.target.parentElement.className = "menu-active";
            event.target.parentElement.nextElementSibling.classList.remove("beta-submodules-expanded");
          }else{
            event.target.className = "menu-active";
            event.target.nextElementSibling.classList.remove("beta-submodules-expanded");
          }
        }
      },
      onClone (evt) {
        let cloneEl = evt.clone;
        let moduleName = $(cloneEl).find('.draggable-item').attr('module-id');
        let moduleType = $(cloneEl).find('.draggable-item').attr('module-type');

        const found = this.findModule(moduleName, moduleType);
        const mod = clone(found);
        // Hack to handle draggable element and re-bind click to addModule method after drag & drop
        // an element into email canvas
        cloneEl.addEventListener('click', (e) => {
          this.addModule(mod);
        });
      },
      onEnd (evt) {
        this.handleEmptyMessage();
      },
      handleEmptyMessage () {
        // If is dragging and the list is empty, hide empty message
        $(".empty-message").is(":visible") && $(".ghost-component").is(":visible")
          ? $(".empty-message").hide("fast")
          : $(".empty-message").show()
      },
      setModuleFixedStatus (item) {
        // Get fixed modules from library config
        const fixedModules = this.campaign.library_config.fixedModules ? JSON.parse(this.campaign.library_config.fixedModules) : [];

        const found = _.filter(fixedModules, fixed => fixed.key === item.key);
        item['isFixed'] = found.length > 0;
        item['fixedPosition'] = found.length > 0 ? found[0].pos : undefined;
      },
    }
  };
</script>
<style lang="less" scoped>
  .icon-plus{
    top: 50%;
    right: 10px;
    font-size: 10px;
    margin: -4px 0 0;
    position: absolute;
     color: #999;
  }
</style>
