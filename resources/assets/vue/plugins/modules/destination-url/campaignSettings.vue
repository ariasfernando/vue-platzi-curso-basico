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
            :class="{'input': true, 'is-danger': errors.has('href') }">
          <span v-show="errors.has('href')" class="help is-danger">{{ errors.first('href') }}</span>
        </p>
        <p v-else>
          <input name="href" type="text" placeholder="http://examp.le" v-model="href">
        </p>
      </span>

      <span v-if="plugin.config.target">
        <label>Target</label>
        <div class="alignment-options">
          <a v-for="(icon, option) in options" 
             name="target"
             :data-tooltip="option"
             :data-value="option"
             :class="option === target  ? 'plugin-setting-active' : ''"
             @click="change"
          >
            <i :class="'glyphicon glyphicon-'+ icon"
               :data-tooltip="option"
               @click="change"
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
    props: ['name', 'plugin'],
    mixins: [mixinValidator],
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
        return this.component.attribute ? this.component.attribute.target : '';
      },
      href: {
        get() {
          return this.component.attribute.href;
        },
        set(value) {
          this.saveComponentAttribute('href', value);

          if (this.validationRules) {
            this.validate();
          }
        },
      },
      validationRules() {
        return this.plugin.config.required ? 'required|url' : null;
      }
    },
    data() {
      return {
        options: this.plugin.config.options,
      }
    },
    methods: {
      change(e) {
        const attribute = e.target.name;
        const value = e.target.getAttribute('data-tooltip');

        this.saveComponentAttribute(attribute, value);
      },
      saveComponentAttribute(attribute, value) {
        const payload = {
          plugin: this.name,
          moduleId: this.currentComponent.moduleId,
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute,
          attributeValue: value,
        };

        this.$store.commit('campaign/saveComponentAttribute', payload);
      },
    },
  }
</script>