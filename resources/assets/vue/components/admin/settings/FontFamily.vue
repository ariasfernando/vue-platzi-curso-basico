<template>
  <div>
    <label class="typo__label col-sm-12 control-label">Font Family</label>

    <div class="col-sm-12">
      <multiselect v-model="value" :options="options()" :multiple="true" :select-label="'Select'" @select="saveValue" :close-on-select="true" :clear-on-select="false" :hide-selected="true" :preserve-search="true" placeholder="Choose font">
        <template slot="tag" slot-scope="props">
          <span v-if="props.option">{{ props.option }}</span>
          <i class="custom__remove glyphicon glyphicon-remove" @click="remove(props)" v-if="props.option"></i>
        </template>
      </multiselect>
    </div>

  </div>
</template>

<script>
  import _ from 'lodash';
  import clone from 'clone';
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'FontFamily',
    props: ['setting'],
    components: {
      Multiselect
    },
    data(){
      return {
        options() {
          const options = [];

          _.each(this.$_app.config.fonts, (group) => {
            _.each(group, (font) => {
              options.push(font);
            });
          });

          return options;
        }
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      value() {
        const module = this.$store.getters["module/module"];
        const component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];

        if (!component.style.fontFamily) {
          return [];
        }

        return component.style.fontFamily.split(', ');
      }
    },
    methods: {
      remove(props) {
        props.remove(props.option);

        let arr = clone(this.value);

        let index = arr.indexOf(props.option);
        if (index !== -1) {
          arr.splice(index, 1);
        }

        this.$store.commit('module/saveComponentStyle', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: 'fontFamily',
          value: arr.join(', '),
        });
      },
      saveValue(selected) {

        let arr = clone(this.value);
        arr.push(selected);

        this.$store.commit('module/saveComponentStyle', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: 'fontFamily',
          value: arr.join(', '),
        });
      }
    }
  }
</script>

<style lang="less">
  .typo__label {
    padding-bottom: 5px;
    display: inline-block;
  }

  .multiselect, .multiselect__input, .multiselect__single {
    color: #666666;
    font-size: 13px;
    font-weight: 300;
  }

  .multiselect__option--highlight {
    background-color: #514960;
  }

  .multiselect .multiselect__content-wrapper {
    z-index: 9999;
  }

  .multiselect__input, .multiselect__single {
    display: inline-block !important;
    position: relative !important;
    float: none !important;
    border: none;
    border-radius: 5px;
    background: #fff !important;
    padding: 1px 0 0 5px;
    width: 100% !important;
    transition: border .1s ease;
    box-sizing: border-box;
    margin-bottom: 8px;
  }

  .multiselect .multiselect__tags{
    border-radius: 2px;
    background: #F4F4F4;
    border: none;
    font-size: 11px;
  }

  .multiselect .multiselect__tags input{
    background: #f4f4f4!important;
  }

  .multiselect .multiselect__tags-wrap span {
    padding-left: 5px;
    font-size: 11px;
  }

  .multiselect .multiselect__tags-wrap i {
    font-size: 7px;
  }

  .multiselect__option--highlight {
    background: #78DCD6;
    color: #fff;
  }
  .multiselect__option--highlight:after {
    background: #78DCD6;
    color: #fff;
  }
</style>