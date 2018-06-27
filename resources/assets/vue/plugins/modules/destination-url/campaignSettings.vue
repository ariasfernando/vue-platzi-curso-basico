<template>
  <div class="plugin-wrapper-inner" v-if="component">
    <div>
      <span>
        <label>Destination Url</label>
        <p v-if="validationRules">
          <input
            name="href"
            type="text"
            placeholder="http://examp.le"
            v-model="href"
            v-validate.initial="validationRules"
            :class="{'input': true, 'is-danger': hasError }">
          <span v-show="hasError" class="help is-danger">{{ getErrorMessage }}</span>
        </p>
        <p v-else>
          <input name="href" type="text" placeholder="http://examp.le" v-model="href">
        </p>
      </span>

      <span v-if="plugin.config.target">
        <label>Target</label>
        <div class="alignment-options">
          <a
            v-for="(icon, option) in options"
            :class="option === target  ? 'plugin-setting-active' : ''"
            :data-tooltip="option"
            @click="changeTarget(option)"
            :key="option"
          >
            <i :class="'glyphicon glyphicon-'+ icon"
               :data-tooltip="option"
               @click="changeTarget(option)"
            ></i>
          </a>
        </div>
      </span>
    </div>

  </div>
</template>

<script>
  import _ from 'lodash';
  import mixinValidator from '../mixins/validator';

  export default {
    props: ['name', 'plugin', 'pluginKey'],
    mixins: [mixinValidator],
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
      moduleErrors() {
        return this.module.data && this.module.data.errors ? this.module.data.errors.filter(err => (_.isEqual(err.scope.name, this.plugin.name)
                                                        && _.isEqual(err.scope.columnId, this.currentComponent.columnId)
                                                        && _.isEqual(err.scope.componentId, this.currentComponent.componentId))) : [];
      },
      hasError() {
        return this.moduleErrors.length > 0;
      },
      getErrorMessage() {
        return this.moduleErrors.length > 0 ? this.moduleErrors[0].msg : '';
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
    data() {
      return {
        options: this.plugin.config.options,
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
