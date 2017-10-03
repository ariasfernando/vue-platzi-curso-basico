<template>
  <div>
    <label class="typo__label col-sm-12 control-label">Font Family</label>

    <div class="col-sm-12">
      <!--multiselect v-model="value" :options="options" :multiple="true" :select-label="'Select'" @select="saveValue" :close-on-select="true" :clear-on-select="false" :hide-selected="true" :preserve-search="true" placeholder="Select Font" label="label" track-by="label"-->
      <multiselect v-model="value" :options="options" :multiple="true" :select-label="'Select'" @select="saveValue" :close-on-select="true" :clear-on-select="false" :hide-selected="true" :preserve-search="true" placeholder="Choose font">
        <template slot="tag" scope="props">
          <span>{{ props.option }}</span>
          <i class="custom__remove glyphicon glyphicon-remove" @click="props.remove(props.option)"></i>
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
        options: this.$app.fonts,
      }
    },
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      value() {
        const module = this.$store.getters["module/module"];
        const component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];
        console.log(component.style.fontFamily);
        return component.style.fontFamily.split(', ');
      }
    },
    methods: {
      saveValue(selected) {

        let arr = clone(this.value);
        arr.push(selected);

        const newValue = arr.join(', ');

        this.$store.commit('module/saveComponentStyle', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          property: 'fontFamily',
          value: newValue,
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

  .multiselect .multiselect__tags-wrap span {
    padding-left: 5px;
    font-size: 11px;
  }

  .multiselect .multiselect__tags-wrap i {
    font-size: 9px;
  }
</style>