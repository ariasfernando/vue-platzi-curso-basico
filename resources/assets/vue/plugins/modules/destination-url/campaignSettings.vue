<template>
  <div>
    <settings-container label="Destination Url" customClass="destination-url" v-if="component">
      <template slot="setting-bottom">
        <p v-if="validationRules">
          <el-input
            name="href"
            type="text"
            size="mini"
            placeholder="http://examp.le"
            v-model="href"
            v-validate.initial="validationRules"
            :class="{'input': true, 'is-danger': errors.has('href') }"></el-input>
          <span v-show="errors.has('href')" class="help is-danger">{{ errors.first('href') }}</span>
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

    <settings-container label="Target" v-if="plugin.config.target">
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
  import mixinValidator from '../mixins/validator';
  import SettingsContainer from "../../../components/common/settings/containers/SettingsContainer.vue";

  export default {
    props: ['name', 'plugin'],
    mixins: [mixinValidator],
    components: { SettingsContainer },
    computed: {
      currentComponent() {
        return this.$store.getters["campaign/currentComponent"];
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

          if (this.validationRules) {
            this.validate();
          }
        },
      },
      validationRules() {
        const rules = [];
        _.each(this.plugin.config.validations, (e,i) => {
          if (e) {
            rules.push(i);
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

<style lang="less" scoped>
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}
.el-button.active {
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
}
.el-button + .el-button {
  margin-left: 0;
}
.el-button {
  width: 28px;
  padding: 4px 0;
  margin-right: 2.67px;
  height: 26px;
  display: block;
  float: left;
  &:last-of-type {
    margin: 0;
  }
}
.padding-zero {
  padding: 0;
}
</style>