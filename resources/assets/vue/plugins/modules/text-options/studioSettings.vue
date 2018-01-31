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

      <div class="btn-group" v-if="plugin.enabled">
       <button v-for="(option, name) in plugin.config.options"
         class="btn toggleable"
         v-b-tooltip.hover
         :title="option.label"
         :name="name"
         :value="option.value"
         :class="{active: option.value}"
         @click.prevent="toggleOption"
         type="button"
        >
          <i :class="option.icon"
             :data-tooltip="option.label"
          ></i>
        </button>
      </div>

      <div v-for="(tinySetting, key) in plugin.config.settings" v-if="plugin.enabled" class="form-group" :key="key">
        <label class="col-sm-7 control-label"><b>{{ tinySetting.title }}</b></label>
        <div class="col-sm-5">
          <span>
            <toggle-button :value="tinySetting.value" :name="key" color="#78DCD6" :sync="true" :labels="true" @change="toggleSetting"></toggle-button>
          </span>
        </div>
        <!-- Input if config needs it -->
        <div class="col-sm-12">
          <div class="btn-group number-input">
            <input v-if="tinySetting.value == true"
              class="btn toggleable"
              v-b-tooltip.hover
              :title="key"
              :name="key"
              :value="tinySetting.content || 0"
              type="number"
              @input.prevent="changeOption"
              min="0"
            />
          </div>
        </div>
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
        // Update state of the component
        this.$store.commit('module/togglePlugin', payload);

        // Set current component
        this.$store.commit("module/setCurrentComponent", {
          columnId: payload.columnId,
          componentId: payload.componentId
        });
        // Update component view in the third column
        this.$store.commit('module/setChangeSettingComponent',{
          style: this.module.structure.columns[payload.columnId].components[payload.componentId].style || {},
          attribute: this.module.structure.columns[payload.columnId].components[payload.componentId].attribute || {}
        });
      },
      toggleOption(e) {
        // Get button, user can clicks the button or the icon
        const parentElement = $(e.target).hasClass("mce-ico") || $(e.target).hasClass("mce-ico-adapter")
          ? e.target.parentElement 
          : e.target;

        // Toggle class active
        $(parentElement).toggleClass('active');
        parentElement.value = $(parentElement).hasClass('active');
        const value = parentElement.value;
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

        // Save plugin data
        this.$store.commit('module/savePlugin', payload);
      },
      toggleSetting(e) {
        const target = e.srcEvent.target;
        const value = e.value;
        const setting = target.parentElement.attributes.getNamedItem('name').value;

        const options = {};
        options[setting] = {
            value,
          };

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            settings: options,
          },
        };

        // Save plugin data
        this.$store.commit('module/savePlugin', payload);
      },
      changeOption(e){
        console.log('aca');
        // Save input value
        const value = e.target.value;
        const setting = e.target.name;
        const options = {};

        const content = value;
          
        options[setting] = {
          content
        };  

        const payload = {
          plugin: this.name,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          config: {
            settings: options,
          },
        };

        // Save plugin data
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
      &.toggleable {
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

      i.mce-ico-adapter {
        font-size: 12px;
        width: 16px;
      }
    }
  }

  .btn-group.number-input{
    text-align: right;
    padding: 10px 0;
  }
</style>