<template>
  <div class="expand st-module-menu-wrapper">
      <h2 v-on:click=" collapsed = !collapsed" v-bind:class="{'config-selected' : collapsed }"><i class="glyphicon glyphicon-th-large glyph-inline"></i> Modules <i class="glyphicon glyphicon-menu-up"></i></h2>

      <draggable class="beta-subitem"
                 :element="'div'"
                 :options="options"
                 :class="{'is-collapsed' : collapsed }"
                 @clone="onClone">
        <div v-for="item in items" class="beta-subitem-single">

          <div v-if="item.sub_menu" class="expand">
            <h2 class="menu-active" :class="{ active: isActive }" @click="expand(item.name)"><i class="glyphicon glyphicon-folder-close glyph-inline"></i> <span>{{ item.name }}</span><i class="glyphicon glyphicon-menu-down"></i></h2>

              <div class="beta-submodules">
                <div v-for="subitem in item.sub_menu">
                  <div class="add single">
                    <h2 class="draggable-item" @click="addModule(subitem)" :module="JSON.stringify(subitem)">
                      {{ subitem.name }} <i class="glyphicon glyphicon-plus"></i>
                    </h2>
                  </div>
                </div>
              </div>

          </div>

          <div v-else class="add single">
            <h2 class="draggable-item" @click="addModule(item)" :module="JSON.stringify(item)">
              {{ item.name }} <i class="glyphicon glyphicon-plus"></i>
            </h2>
          </div>

        </div>
      </draggable>
  </div>
</template>

<script>

  import clone from 'clone';
  import moduleService from '../../services/module';
  import _ from 'lodash';
  import Draggable from 'vuedraggable';

  export default {
    name: 'CampaignMenu',
    components: {
      Draggable
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
          ghostClass: "ghost-component",  // Class name for the drop placeholder
          chosenClass: "chosen-component",  // Class name for the chosen item
          dragClass: "drag-component"  // Class name for the dragging item
        },
        expanded: [],
        collapsed: false,
        isActive: false
      }
    },
    computed: {
      items () {
        return this.$store.state.campaign.campaign.menu_list;
      },
    },
    created() {
      _.each(this.items, (item) => {
        if (item.sub_menu) {
          this.expanded[item.name] = false;
        }
      });
    },
    methods: {
      addModule (module) {
        const mod = clone(module);
        mod.data = {};

        // Add module
        this.$store.commit('campaign/addModule', mod);

        // Set active on last module added
        this.$store.commit('campaign/setActiveLastModule');

        setTimeout(() => {
          this.autoScroll();
        }, 100);
      },
      autoScroll(){
        let bounds = $(".section-canvas-container").outerHeight();
        let isVisible = bounds < window.innerHeight && bounds > 0;

        if (!isVisible) {
            $('html,  .section-canvas-email').animate({
                scrollTop: bounds
            }, 2000);
        }
      },
      expand (item) {
        const index = this.expanded.indexOf(item);
        if (index !== -1) {
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item);
        }

        if(event.target.className === "menu-active") {
          event.target.className = "selected";
          event.target.nextElementSibling.className += " beta-submodules-expanded";
        } else {
          event.target.className = "menu-active";
          event.target.nextElementSibling.classList.remove("beta-submodules-expanded");
        }
      },
      onClone: function (evt) {
        // Hack to handle draggable element and re-bind click to addModule method after drag & drop an element into email canvas
        let cloneEl = evt.clone;
        cloneEl.addEventListener('click', (e) => {
          let module = JSON.parse($(cloneEl).find('.draggable-item').attr('module'));
          this.addModule(module);
        });
      }
    }
  };
</script>
<style lang="less">
  @icon-option: #69dac8;
  @focus: #69dac8;
  @focus-light: lighten(@focus, 30%);
  @hover: @focus-light;

   #emailCanvas{
     &:empty{
      border: none;
      color:@focus;
      background-color: @hover;
      height: 80px;
      line-height: 80px;
      font-family: 'Open Sans', Arial, serif;
      font-size: 16px;

      &:before{
        content: "Drag modules here... Or just click’em!";
        width: 100%;
        display: flex;
        justify-content: center;
        opacity: 0.7;

      }

      &:hover{
        &:before{
          display: none;
        }

        &:after{
          content: "Drag modules here... Or just click’em!";
          width: 100%;
          display: flex;
          justify-content: center;
          opacity: 1;
          outline: 2px dashed @icon-option;
          outline-offset: -10px;
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
      font-size: 13px;
      z-index: 300;
      opacity: 1!important;
      &:before{
        content: "Drag modules here... Or just click’em.";
        display: flex;
        justify-content: center;
        border: none;
        color:@focus;
        background-color: @hover;
        height: 80px;
        line-height: 80px;
        font-family: 'Open Sans', Arial, serif;
        font-size: 16px;
        opacity: 1;
        outline: 2px dashed @icon-option;
        outline-offset: -10px;
      }
      *{
        display: none;
      }
    }
  }
</style>
