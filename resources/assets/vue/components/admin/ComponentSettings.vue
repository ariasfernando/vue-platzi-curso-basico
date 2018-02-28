<template>
  <div class="component-settings" v-if="ready">

    <!-- START: Style -->
    <b-btn block v-b-toggle.style class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-pencil"></i> STYLES</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="style" visible accordion="module-settings-accordion-right">
      <b-card class="default-settings">
        <form class="form-horizontal">
          <div v-for="(settingGroup, groupKey) in component.componentSettings" style="border: 1px solid #ccc; padding: 5px; margin: 5px 0;" :key="groupKey">
            <component v-for="setting in settingGroup"
              :is="'input-' + setting.type"
              @attribute-setting-updated="attributeSettingUpdatedHandler"
              @style-setting-updated="styleSettingUpdatedHandler"
              @style-option-setting-updated="styleOptionSettingUpdatedHandler"
              :setting="setting.type"
              :name="setting.name"
              :type="setting.type"
              :link="setting.link"
              :label="setting.label"
              :default-value="setting.value"
              :min-value="setting.minValue"
              :max-value="setting.maxValue"
              :element="component"
              :key="setting.name"></component>
          </div>

          <div class="form-group" :class="'field-' + setting.name" v-for="(setting, key) in component.settings" :key="setting.name">

            <div v-if="!setting.group" >
              <label class="col-sm-6 control-label" :for="setting.name">{{ setting.label }}</label>
              <div class="col-sm-6 position-relative content-colorpicker">
                <!-- Input File -->
                <input v-if="setting.type === 'file'"
                        v-validate="'required'"
                        :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                        :name="setting.name"
                        type="file"
                        @change="onFileChange">

                <!-- Input Text -->
                <el-input
                  v-if="setting.type === 'text'"
                  size="mini"
                  v-model="setting.value"
                  :placeholder="setting.label"
                  @change="(val)=>saveComponent(val, setting)"
                  :class="{'is-danger': errors.has(setting.name) }"
                ></el-input>

                <el-input-number
                  size="mini" 
                  v-if="setting.type === 'number'"
                  v-model="setting.value"
                  :placeholder="setting.label"
                  @change="(val)=>saveComponent(val, setting)"
                  :class="{'is-danger': errors.has(setting.name) }"
                  :min="0"
                ></el-input-number>

                <!-- Input select -->
                <span v-if="setting.type === 'select'">
                  <b-form-select
                    v-model="setting.value"
                    :options="setting.options"
                    @change.native="(evt)=>saveComponentByEvent(evt, setting)">
                  </b-form-select>
                </span>

                <!-- Input color -->
                <div @click.prevent="toggleSketch">
                  <input v-if="setting.type === 'color'"
                          v-validate="'required'"
                          v-model="setting.value.hex"
                          type="text"
                          class="sketchbackground"
                          :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                          :placeholder="setting.label"
                          @click.prevent="toggleSketch"
                          disabled
                          @change="(evt)=>saveComponentByEvent(evt, setting)">
                </div>

                <div v-if="setting.type === 'color'"
                      class="icon-remove st-remove-sketch"
                      @click.prevent="toggleSketch"
                >
                  <i class="glyphicon glyphicon-remove"></i>
                </div>
                <sketch-picker v-if="setting.type === 'color'"
                                v-model="setting.value"
                                class="sketch-picker"
                                @click.native="updateColorPickerSetting(setting.name, setting.link, false )"></sketch-picker>

                <!-- Span General Error -->
                <span v-show="errors.has(setting.name)"
                      class="help is-danger">{{ errors.first(setting.name) }}
                </span>
              </div>
            </div>

            <div v-else>
              <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
              <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker"
                    v-for="(settingGroup, keyGroup) in setting.group" :key="settingGroup.name">
                <!-- Input Text -->
                <input v-if="settingGroup.type === 'text'"
                        :class="{'input': true, 'is-danger': errors.has(settingGroup.name) }"
                        :name="settingGroup.name"
                        :placeholder="settingGroup.label"
                        v-model="settingGroup.value"
                        type="text"
                        v-validate="'required'"
                        @change="(evt)=>saveComponentByEvent(evt, settingGroup)">

                <!-- Input select -->
                <span v-if="settingGroup.type === 'select'">
                <b-form-select v-model="settingGroup.value" :name="settingGroup.name" :options="settingGroup.options" @change.native="saveComponentByEvent" >
                  </b-form-select>
                </span>

                <!-- Input color -->
                <div @click.prevent="toggleSketch">
                  <input v-if="settingGroup.type === 'color'"
                          v-model="settingGroup.value.hex"
                          v-validate="'required'"
                          type="text"
                          class="sketchbackground"
                          :class="{'input': true, 'is-danger': errors.has(settingGroup.name) }"
                          :name="settingGroup.name"
                          :placeholder="settingGroup.label"
                          @click.prevent="toggleSketch"
                          @input="(evt)=>saveComponentByEvent(evt, settingGroup)"
                          disabled>
                </div>
                <div v-if="settingGroup.type === 'color'"
                      class="icon-remove st-remove-sketch"
                      @click.prevent="toggleSketch"
                >
                  <i class="glyphicon glyphicon-remove"></i>
                </div>
                <sketch-picker v-if="settingGroup.type === 'color'"
                                v-model="settingGroup.value"
                                class="sketch-picker"
                                @click.native="updateColorPickerSetting(settingGroup.name, settingGroup.link, true )"></sketch-picker>

                <!-- Span General Error -->
                <span v-show="errors.has(settingGroup.name)"
                      class="help is-danger">{{ errors.first(settingGroup.name) }}
                </span>

              </div>
            </div>
          </div>
        </form>
      </b-card>
    </b-collapse>
    <!-- END: Style -->

    <!-- START: Funcionalities -->
    <b-btn block v-b-toggle.funcionalities class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-tasks"></i> FUNCTIONALITIES</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="funcionalities" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <div
          v-for="(plugin, key) in component.plugins"
          v-if="!shouldRenderInStyles(plugin)"
          class="plugin-wrapper"
          :class="'plugin-' + plugin.name"
          :key="key"
        >
          <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
        </div>
      </b-card>
    </b-collapse>
    <!-- END: Funcionalities -->

    <!-- START: Mobile Settings -->    
    <b-btn block v-b-toggle.mobile class="module-settings-item">
      <p class="pull-left"><i class="glyphicon glyphicon-tasks"></i> MOBILE</p>
      <i class="glyphicon glyphicon-menu-down menu-dropdown pull-right"></i>
    </b-btn>

    <b-collapse id="mobile" accordion="module-settings-accordion-right">
      <b-card class="plugins">
        <div
          v-for="(plugin, key) in component.plugins"
          v-if="shouldRenderInStyles(plugin)"
          class="plugin-wrapper"
          :class="'plugin-' + plugin.name"
          :key="key"
        >
          <component :is="'studio-' + plugin.name" :name="key" :plugin="plugin"></component>
        </div>
      </b-card>
    </b-collapse>
    <!-- END: Mobile Settings -->
  </div>
</template>

<script>

  import _ from "lodash";
  import BootstrapVue from "bootstrap-vue";
  import { Sketch } from "vue-color";
  import * as elementSettings from "./settings";
  export default {
    data () {
      return {
        ready: false,
        component: {}
      };
    },
    components: {
      BootstrapVue,
      "sketch-picker": Sketch,
      "input-font-family": elementSettings.FontFamily,
      "input-font-style": elementSettings.FontStyle,
      "input-text-align": elementSettings.TextAlign,
      "input-vertical-align": elementSettings.VerticalAlign,
      "input-image-size": elementSettings.ImageSize,
      "input-button-caret": elementSettings.ButtonCaret,
      "input-input-height": elementSettings.InputHeight,
      "input-font-weight": elementSettings.FontWeight,
      "input-background-color": elementSettings.BackgroundColor,
      "input-font-color": elementSettings.FontColor,
      "input-letter-spacing": elementSettings.LetterSpacing,
      "input-padding": elementSettings.Padding,
      "input-border-group": elementSettings.BorderGroup,
      "input-generic-text": elementSettings.GenericText,
      "input-generic-number": elementSettings.GenericNumber,
      "input-generic-file": elementSettings.GenericFile,
    },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      }
    },
    watch : {
      currentComponent: {
        handler: function(currentComponent) {
          let module = this.$store.getters["module/module"];
          if (!_.isEmpty(currentComponent) && currentComponent.componentId >= 0) {
            this.component =
              module.structure.columns[currentComponent.columnId].components[
                currentComponent.componentId
                ];
            this.ready = true;
          } else {
            this.ready = false;
          }
        },
        deep: true
      }
    },
    methods: {
      toggleSketch(e){
        const inputElement = e.toElement;
        $(inputElement)
          .closest(".content-colorpicker")
          .find(".sketch-picker, .st-remove-sketch")
          .toggleClass("st-show-element");
      },

      onFileChange(e) {
        const files = e.target.files || e.dataTransfer.files;

        if (!files.length) return;

        this.createImage(files[0]);
      },
      createImage(file) {
        const reader = new FileReader();
        const vm = this;

        reader.onload = e => {
          vm.image = e.target.result;

          // Upload Image
          this.$store
            .dispatch("module/uploadImages", {
              images: [vm.image]
            })
            .then(res => {
              this.updateAttributePlaceholder("customer/modules" + res[0]);
            });
        };

        reader.readAsDataURL(file);
      },

      updateAttributePlaceholder(imgSrc) {
        // Set the src after we have loaded the new image
        const tmp = new Image();
        tmp.src = this.$_app.config.imageUrl + imgSrc;

        tmp.onload = () => {
          this.component.attribute.placeholder = imgSrc;

          _.each(this.component.settings, (option) => {
            if (option.name === 'placeholder') {
              option.value = imgSrc;
            }
          });
        };

        tmp.onerror = () => {
          // Retry to load image
          this.updateAttributePlaceholder(imgSrc);
        };

      },

      saveComponentByEvent(evt, setting) {
        this.saveComponent(evt.target.value, setting);
      },

      saveComponent(val, setting) {
        const data = {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: setting.name,
          value: val
        };

        if (setting.link === 'style') {
          this.$store.commit('module/saveComponentStyle', data);
        }

        if (setting.link === 'attribute') {
          this.$store.commit('module/saveComponentAttribute', data);
        }
      },

      saveComponentStyle(name, value) {
        const data = {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: name,
          value: value
        };

        this.$store.commit('module/saveComponentStyle', data);
      },

      saveComponentAttribute(name, value) {
        const data = {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: name,
          value: value
        };

        this.$store.commit('module/saveComponentAttribute', data);
      },

      saveComponentStyleOption(name, value) {
        const data = {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: name,
          value: value
        };

        this.$store.commit('module/saveComponentStyleOption', data);
      },

      // TODO Update date used mutation.
      updateColorPickerSetting( name, link , isGroup ){
        _.each(this.component.settings, (option, index) => {
          if ( isGroup ){
            _.each(option.group, (optionGroup, indexGroup) => {
              if (optionGroup.name === name) {
                if (link === "style") {
                  this.component[link][name] = optionGroup.value.hex;
                }else{
                  this.component[link][name] = optionGroup.value;
                }
              }
            });
          }else{
            if (option.name === name) {
              if (link === "style") {
                this.component[link][name] = option.value.hex;
              }else{
                this.component[link][name] = option.value;
              }
            }
          }
        });
        // this.$store.commit("module/setChangeSettingComponent", {
        //   style: this.component.style || {},
        //   attribute: this.component.attribute || {}
        // });
      },
      shouldRenderInStyles(plugin) {
        return _.indexOf(plugin.target, "styles") >= 0;
      },
      attributeSettingUpdatedHandler(eventData) {
        this.saveComponentAttribute(eventData.name, eventData.value);
      },
      styleSettingUpdatedHandler(eventData) {
        this.saveComponentStyle(eventData.name, eventData.value);
      },
      styleOptionSettingUpdatedHandler(eventData) {
        this.saveComponentStyleOption(eventData.name, eventData.value);
      }
    }
  };
</script>

<style lang="less">
@focus: #78dcd6;
@focus-light: lighten(@focus, 30%);
.component-settings{
  height: calc(~"100vh - 105px");
  overflow: auto;
}
.vue-js-switch {
  margin-top: 4px;
}

.plugin-wrapper,
.row-toggle {
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 15px;

  b {
    font-weight: 300;
    color: #333333;
  }
}

button[aria-expanded="false"] {
  opacity: 0.5;
  transition: all 0.3s linear;

  &:hover {
    opacity: 1;
  }
}

button[aria-expanded="true"] {
  opacity: 1;

  p {
    font-weight: 600 !important;
  }
  i {
    transform: rotate(180deg);
  }
}
</style>
