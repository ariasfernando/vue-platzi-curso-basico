import _ from 'lodash';
import { Sketch } from 'vue-color';
import BootstrapVue from 'bootstrap-vue';

export default {
  props: {
    columnSetting: {
      type: Object,
      default: () => []
    },
    columnKey: {
      type: Number,
      default: ''
    }
  },
  components: {
    BootstrapVue,
    'sketch-picker': Sketch,
  },
  computed: {
    module() {
      return this.$store.getters["module/module"];
    },
    activeColumn() {
      return this.$store.getters["module/activeColumn"];
    }
  },
  watch : {
    activeColumn(val) {
      setTimeout(() => {
        this.$refs.tabs.setTab(val);
      }, 100);
    },
  },
  data () {
    return {
      optionsSelectedBorderStyle: [
        { value: 'solid', text: 'solid' },
        { value: 'inherit', text: 'inherit' },
        { value: 'initial', text: 'initial' },
        { value: 'outset', text: 'outset' },
        { value: 'inset', text: 'inset' },
        { value: 'double', text: 'double' },
        { value: 'dashed', text: 'dashed' },
        { value: 'dotted', text: 'dotted' },
        { value: 'hidden', text: 'hidden' },
        { value: 'none', text: 'none' },
      ],
      tabIndex: null,
      enabled: false,
    }
  },
  methods: {
    toggleSketch(e){
      const inputElement = e.toElement;
      $(inputElement).closest('.content-colorpicker').find('.sketch-picker, .st-remove-sketch, .checkbox-transparent')
                                                     .toggleClass('st-show-element');
    },
    saveColumnSettings( key ) {
      console.log("save", key)
      _.each(this.module.structure.columns[key].settings, (option, index) => {
        if (option.link === 'style') {
          if ( option.group && option.group.length > 0 ){
            _.each(option.group, (optionGroup, indexGroup) => {
              this.module.structure.columns[key].style[optionGroup.name] = optionGroup.value;
            });
          }else{
            this.module.structure.columns[key].style[option.name] = option.value;
          }
        }
        if (option.link === 'attribute') {
          if (option.group && option.group.length > 0 ){
            _.each(option.group, (optionGroup, indexGroup) => {
              this.module.structure.columns[key].attribute[optionGroup.name] = optionGroup.value;
            });
          }else{
            this.module.structure.columns[key].attribute[option.name] = option.value;
          }
        }
      });
    },
    // TODO Update date used mutation.
    updateColumnSettings( key , name, link , isGroup, transparentChecked ){
      console.log("update", [key, name, link, isGroup, transparentChecked])
      _.each(this.module.structure.columns[key].settings, (option, index) => {

          if ( isGroup ){
             _.each(option.group, (optionGroup, indexGroup) => {
              if (optionGroup.name === name) {
                  this.module.structure.columns[key][link][name] = (transparentChecked)? 'transparent':optionGroup.value.hex;
              }
            });
          }else{
            if (option.name === name) {
              this.module.structure.columns[key][link][name] = (transparentChecked)? 'transparent':option.value.hex;
            }
          }

      });
    },

    updateFromPicker(value) {
      this.colors = value;
      console.log('changed by picker');
    },


  },
}