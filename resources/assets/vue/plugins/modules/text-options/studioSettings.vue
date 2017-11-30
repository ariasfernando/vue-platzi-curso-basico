<template>
  <div :class="'plugin-' + plugin.name">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-7 control-label"><b>{{ plugin.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="plugin.enabled" color="#78DCD6" :sync="true" :labels="true" @change="toggle"></toggle-button>
          </span>
        </div>
      </div>

      <div class="btn-group">
       <button v-if="plugin.enabled" v-for="(option, name) in plugin.data.options" 
         :data-tooltip="option.label"
         :class="'btn selectable'"
         :name="name"
         :value="option.value"
         :class="[option.value ? 'active' : '']"
         @click.prevent="toggleOption"
         type="button"
        >
          <i :class="'mce-ico ' + option.icon" 
             :data-tooltip="option.label"
          ></i>
        </button>
      </div>
    </form>

  </div>
</template>

<script>

  import _ from 'lodash';
  
  export default {
    props: ['name'],
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      module() {
        return this.$store.getters["module/module"];
      },
      plugin() {
        const module = this.module,
              columnId = this.currentComponent.columnId,
              componentId = this.currentComponent.componentId;

        const plugin = module.structure.columns[columnId].components[componentId].plugins[this.name];
        this.enabled = plugin.enabled;
        this.options = plugin.config.options;

        return plugin;
      }
    },
    data() {
      return {
        enabled: false,
        options: {},
      }
    },
    methods: {
      toggle(e) {
        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          enabled: e.value,
        };

        this.$store.commit('module/togglePlugin', payload);
      },
      toggleOption(e) {
        const parentElement = $(e.target).hasClass("mce-ico")
          ? e.target.parentElement 
          : e.target;

        // toggle class
        $(parentElement).toggleClass('active');
        parentElement.value = $(parentElement).hasClass('active');
        const value = parentElement.value;

        console.log("value", value);
        
        const option = parentElement.attributes.getNamedItem('name').value;

        const options = {};
        options[option] = {
          value: (value == 'true')
        };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            options,
          },
        };

        console.log("payload", payload)

        this.$store.commit('module/savePlugin', payload);
      }
    }
  }
</script>
<style lang="less">
  .btn-group {
    text-align: left;
    padding: 5px 5px 10px;
    .btn {
      &.selectable {
        background: #E9E9E9;
        padding: 4px 8px;
        margin: 2px;
        border-color: transparent;

        &.active {
          background: #78DCD6 !important;
          color: #FFFFFF !important;
        }

        &:hover {
          background: #78DCD6 !important;
        }
      }
    }

    button[data-tooltip]:after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 130%;
      left: 6%;
      font-size: 12px;
      font-weight: 300;
      background: #666666;
      padding: 2px 7px;
      color: #FFFFFF;
      border-radius: 2px;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.5s ease;
    }
    button[data-tooltip]:before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-top: 10px solid #666666;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      transition: all 0.5s ease;
      opacity: 0;
      left: 10%;
      bottom: 90%;
    }
    button[data-tooltip]:hover:after {
      bottom: 54%;
    }
    button[data-tooltip]:hover:before {
      bottom: 52%;
    }
    button[data-tooltip]:hover:after,
    button[data-tooltip]:hover:before {
      opacity: 1;
    }
  }
</style>