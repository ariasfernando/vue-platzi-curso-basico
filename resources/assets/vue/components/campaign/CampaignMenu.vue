<template>
  <div class="expand st-module-menu-wrapper">
    <label-item-container label="MODULES" icon="glyphicon-th-large" v-b-toggle.modules></label-item-container>
      <b-collapse id="modules" visible class="card">
        <div v-if="ready" v-for="(item, i) in items" :key="i" >
          <div v-if="item.sub_menu" class="expand-subitem-button">
            <label-item-container :label="item.name" icon="glyphicon-folder-open" v-b-toggle="item.name" class="subitem-button"></label-item-container>
              <b-collapse :id="item.name" class="content-collapse">
                  <div v-for="(subitem, j) in item.sub_menu" :key="j">
                    <draggable :element="'div'" :options="options" @clone="onClone" @end="onEnd" v-if="!subitem.mandatory">
                      <group-container  @click="addModuleByKey(subitem.key, 'subitem')" :clickeable="true">
                        <settings-container :label="subitem.name" customClass="draggable-item" :module-id="subitem.key" :module-type="'subitem'" >
                          <template slot="setting-right">
                            <i class="glyphicon glyphicon-plus icon-plus" style="float: right;"></i>
                          </template>
                        </settings-container>
                      </group-container>
                    </draggable>
                  </div>
              </b-collapse>
          </div>
        <draggable v-else-if="!item.mandatory"  :element="'div'" :options="options" @clone="onClone" @end="onEnd">
            <group-container @click="addModuleByKey(item.key, 'item')" :clickeable="true">
              <settings-container :label="item.name" customClass="draggable-item" :module-id="item.key" :module-type="'item'" >
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
  import _, {
    each
  } from 'lodash';
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
    data() {
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
      campaign() {
        return this.$store.getters["campaign/campaign"];
      },
      items() {
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
            _.each(item.sub_menu, (subItem) => {
              if (subItem.mandatory) {
                this.addMandatoryModule(subItem);
              }
            });
          } else {
            // First level modules in library menu
            if (item.mandatory) {
              this.addMandatoryModule(item);
            }
          }
        });

        this.ready = true;
      }, error => {
        this.$store.commit("global/setLoader", false);
        this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {
          className: 'et-error'
        });
      });
    },
    methods: {
      getLibrary() {
        return this.$store.dispatch("library/getModulesData", this.libraryId);
      },
      addModuleByKey(moduleKey, moduleType) {
        const found = this.findModule(moduleKey, moduleType);
        const mod = clone(found);

        this.addModule(mod);
      },
      expand(event, item) {
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
      onClone(evt) {
        let cloneEl = evt.clone;
        let moduleKey = $(cloneEl).find('.draggable-item').attr('module-id');
        let moduleType = $(cloneEl).find('.draggable-item').attr('module-type');

        const found = this.findModule(moduleKey, moduleType);
        const mod = clone(found);
        mod.data = {};
        // Hack to handle draggable element and re-bind click to addModule method after drag & drop
        // an element into email canvas
        cloneEl.addEventListener('click', (e) => {
          this.addModule(mod);
        });
      },
      onEnd(evt) {
        this.handleEmptyMessage();
      },
      handleEmptyMessage() {
        // If is dragging and the list is empty, hide empty message
        $(".empty-message").is(":visible") && $(".ghost-component").is(":visible")
          ? $(".empty-message").hide("fast")
          : $(".empty-message").show()
      },
      addMandatoryModule(item) {
        if (this.isBottomModule(item)) {
          if (!this.campaignHasFixedBottomModule(item)) {
            this.addFixedBottomModule(item);
          }
        } else if (this.isTopModule(item)) {
          if (!this.campaignHasFixedTopModule(item)) {
            this.addFixedTopModule(item);
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .draggable-item /deep/ .half-setting{
    width: 11%;
  }
  .draggable-item /deep/ label.half{
    width: 89%;
  }
  .icon-plus{
    top: 50%;
    right: 10px;
    font-size: 10px;
    margin: -4px 0 0;
    position: absolute;
     color: #999;
  }
  .collapsed  /deep/ .glyphicon-folder-open:before {
    content: "\E117";
  }
  .subitem-button{
    cursor: pointer;
    transition: all 0.3s linear;
    background: #edecef;
    border: 0;
    line-height: 13px;
    box-shadow: none;
    padding: 15px 10px 13px 10px;
  }
  .expand-subitem-button{
    background: #edecef;
    border: 1px solid #d5d3d9;
    margin-bottom: 5px;
    border-radius: 2px;
    position: relative;
  }
  .expand-subitem-button /deep/ p{
    color: #514960!important;
    margin-left: -5px;
  }
  .expand-subitem-button  /deep/ .glyphicon-folder-open{
    position: absolute;
    right: 7px;
    top: 15px;
    color: #514960!important;
    opacity: 0.8;
  }
  .expand-subitem-button  /deep/ .glyphicon-menu-down{
    display: none;
  }
  .content-collapse{
    background: #edecef;
    padding: 4px 6px 0 6px;
    background: #f9f9f9;
    border-radius: 3px;
    padding-bottom: 5px;
  }
  .content-collapse /deep/ div:last-child .group-container{
    margin-bottom: 0px;
  }
</style>
