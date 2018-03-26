<template>
  <div class="expand st-module-menu-wrapper">
      <h2 v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-th-large glyph-inline"></i> Modules <i class="glyphicon glyphicon-menu-up"></i></h2>

      <div class="beta-subitem" :class="{'is-collapsed' : collapsed }">
          <div v-if="ready" v-for="item in items" class="beta-subitem-single">

            <div v-if="item.sub_menu" class="expand">
              <h2 class="menu-active" :class="{ active: isActive }" @click="(e) => expand(e, item.name)"><i class="glyphicon glyphicon-folder-close glyph-inline"></i> <span>{{ item.name }}</span><i class="glyphicon glyphicon-menu-down"></i></h2>

                <div class="beta-submodules">
                  <div v-for="subitem in item.sub_menu">
                    <draggable :element="'div'" :options="options" @clone="onClone" @end="onEnd">
                      <div class="add single">
                        <h2 class="draggable-item" @click="addModuleByName(subitem.name, 'subitem')" :module-id="subitem.name" :module-type="'subitem'">
                          {{ subitem.title || subitem.name }} <i class="glyphicon glyphicon-plus"></i>
                        </h2>
                      </div>
                    </draggable>
                  </div>
                </div>

            </div>

            <draggable v-else :element="'div'" :options="options" @clone="onClone" @end="onEnd">
              <div class="add single">
                <h2 class="draggable-item" @click="addModuleByName(item.name, 'item')" :module-id="item.name" :module-type="'item'">
                  {{ item.title || item.name }} <i class="glyphicon glyphicon-plus"></i>
                </h2>
              </div>
            </draggable>

          </div>
      </div>

  </div>
</template>

<script>

  import clone from 'clone';
  import _ from 'lodash';
  import Draggable from 'vuedraggable';

  export default {
    name: 'CampaignMenu',
    components: {
      Draggable
    },
    props: {
      libraryId: {
        type: String,
        required: true
      }
    },
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
      items () {
        return this.$store.getters["library/modules"];
      },
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      activeModule() {
        const activeModuleId = this.$store.getters["campaign/activeModule"];
        return this.modules[activeModuleId] || undefined;
      }
    },
    created() {

      this.getLibrary().then(response => {
        _.each(this.items, (item) => {
          if (item.sub_menu) {
            this.expanded[item.name] = false;
          }
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
      getSubitemsAsArray () {
        return _.reduce(this.items, (result, value) => {
          if(_.has(value, 'level')) {
            result = _.union(result, value.sub_menu);
          }
          return result;
        }, []);
      },
      addModuleByName (moduleName, type) {
        // Find module in items by type: item or subitem
        const found = type === 'item'
          ? _.find(this.items, (m) => m.name === moduleName)
          : _.find(this.getSubitemsAsArray(), (m) => m.name === moduleName)

        const mod = clone(found);
        mod.data = {};

        this.addModule(mod);

      },
      addModule (m) {
        const mod = clone(m);

        // Add module
        this.$store.commit('campaign/addModule', mod);

        // Set active on last module added
        this.$store.commit('campaign/setActiveLastModule');

        if (this.activeModule.type === 'studio') {
          // Save current component if module type is studio
          this.$store.commit('campaign/setCurrentComponent', {
            moduleId: this.modules.length - 1,
            columnId: 0,
            componentId: 0,
          });
          this.$store.commit('campaign/unsetCustomModule');
        } else {
          // Save customModule if module type is custom
          this.$store.commit('campaign/setCustomModule', this.modules.length - 1);
          this.$store.commit('campaign/unsetCurrentComponent');
        }

        setTimeout(() => {
          this.autoScroll();
        }, 25);
      },
      autoScroll (){
        let bounds = $(".section-canvas-container").outerHeight();
        let isVisible = bounds < window.innerHeight && bounds > 0;

        if (!isVisible) {
            $('html,  .section-canvas-email').animate({
                scrollTop: bounds
            }, 100);
        }
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
        // Find module into items as item or subitem
        const found = moduleType === 'item'
          ? _.find(this.items, (m) => m.name === moduleName)
          : _.find(this.getSubitemsAsArray(), (m) => m.name === moduleName)

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
    }
  };
</script>
<style lang="less">
  @icon-option: #69dac8;
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;
  @font-color: #999999;
  @bg-color: #f0f0f0;

   #emailCanvas{
     &.empty{
      border: none;
      color:@font-color;
      background-color: @bg-color;
      height: 65px;
      font-family: 'Open Sans', Arial, serif;
      font-size: 12px;
      padding: 0 20px;

      .empty-message {
        width: 100%;
        display: table-cell;
        vertical-align: middle;
        opacity: 0.7;
        text-align: center;

        &:hover {
          width: 100%;
          display: table-cell;
          vertical-align: middle;
          opacity: 1;
          outline: 2px dashed @font-color;
          outline-offset: -10px;
          text-align: center;
        }
      }
    }

    .ghost-component{
      text-align: center;
      color:@focus;
      background-color: @hover;
      display: table-row;
      vertical-align: middle;
      list-style-type: none;
      font-size: 14px;
      z-index: 300;
      opacity: 1!important;
      &:before{
        content: "Drag the module here";
        display: table-cell;
        vertical-align: middle;
        border: none;
        color:@focus;
        background-color: @hover;
        height: 65px;
        font-family: 'Open Sans', Arial, serif;
        font-size: 14px;
        opacity: 1;
        outline: 2px dashed @icon-option;
        outline-offset: -10px;
        text-align: center;
        padding: 0 10px;
      }
      *{
        display: none;
      }
    }
  }
</style>
