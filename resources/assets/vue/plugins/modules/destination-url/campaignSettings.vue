<template>
  <div>
    <settings-container label="Destination Url" customClass="destination-url" v-if="component" key="destination-url">
      <template slot="setting-bottom">
        <p v-if="validationRules">
          <el-input
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le"
            v-model="href"
            v-validate.initial="validationRules"
            :class="{'input': true, 'is-danger': hasError }"></el-input>
          <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
        </p>
        <p v-else>
          <el-input
          name="href"
          type="text"
          size="mini"
          placeholder="http://examp.le"
          v-model="href"></el-input>
        </p>
      </template>
    </settings-container>

    <settings-container label="Target" v-if="plugin.config.target" key="target">
      <template slot="setting-right">
        <el-button
          v-for="(icon, option) in plugin.config.options"
          plain
          size="mini"
          :class="[`glyphicon glyphicon-${icon}`,{ 'active': target === option }]"
            :data-tooltip="option"
            @click="changeTarget(option)"
            :key="option"
          >
        </el-button>

      </template>
    </settings-container>
  </div>
</template>

<script>
  import _ from 'lodash';
  import validatorMixin from '../mixins/validator';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";
  import urlDestination from '../../../resources/validator_rules'

  export default {
    props: ['name', 'plugin', 'pluginKey'],
    mixins: [validatorMixin],
    components: { SettingsContainer },
    mounted() {
      if (this.validationRules) {
        this.validate();
      }
    },
    watch: {
      currentComponent: {
        handler: function(currentComponent) {
          if (this.validationRules) {
            this.validate();
          }
        },
        deep: true
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
      },
      module() {
        return this.$store.getters["campaign/modules"][this.currentComponent.moduleId];
      },
      component() {
        let component = {};
        if (Object.keys(this.currentComponent).length !== 0) {
          const moduleId = this.currentComponent.moduleId;
          const columnId = this.currentComponent.columnId;
          const componentId = this.currentComponent.componentId;

          component = this.$store.getters["campaign/modules"][moduleId].structure.columns[columnId].components[componentId];
        }
        return component;
      },
      target() {
        return this.component[this.plugin.subComponent].attribute ? this.component[this.plugin.subComponent].attribute.target : '_blank';
      },
      href: {
        get() {
          return this.component[this.plugin.subComponent].attribute.href;
        },
        set(value) {
          this.saveComponentProperty('href', value);

          this.$nextTick(() => {
          if (this.validationRules) {
            this.validate();
          }
          });
        },
      },
      validationRules() {
        const rules = [];
        _.each(this.plugin.config.validations, (e,i) => {
          if (e === true) {
            rules.push(i);
          } else if(typeof e == 'object' && e.selected !== 'disabled'){
            rules.push(e.selected);
          }
           
        });
        return rules.join('|');
      }
    },
    methods: {
      changeTarget(option) {
        const property = 'target';
        const value = option;

        this.saveComponentProperty(property, value);
      },
      saveComponentProperty(property, value) {
        const payload = {
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          subComponent: this.plugin.subComponent,
          link:'attribute',
          property,
          value: value,
        };

        this.$store.commit('campaign/saveComponentProperty', payload);
      },
      
    },
  }
</script>

<style lang="scss" scoped>
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: #78dcd6;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);

  &:before{
    color: #ffffff;
  }
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 33%;
  padding: 4px 0;
  margin-right: 0px;
  height: 26px;
  border-radius: 0px;
  border-right: none;

  &:before{
    color: #999999;
  }

  &:first-of-type {
    margin: 0;
    border-radius: 2px 0px 0px 2px;
    border-right: none;
  }

  &:last-of-type {
    margin: 0;
    border-radius: 0px 2px 2px 0px;
    border-right: 1px solid #dddddd;
  }
}
.el-button:first-child:nth-last-child(2),
.el-button:first-child:nth-last-child(2) ~ button {
    width: 50%;
}
.el-button:first-child:nth-last-child(3),
.el-button:first-child:nth-last-child(3) ~ button {
    width: 33%;
}
.el-button:first-child:nth-last-child(4),
.el-button:first-child:nth-last-child(4) ~ button{
    width: 25%;
}
.padding-zero {
  padding: 0;
}
.el-input >>> .el-input__inner{
  border-radius: 2px;
  font-weight: 300;
  padding-left: 8px;
  height: 26px;

  &:focus{
    border: 1px solid #78dcd6;
  }
}
</style>