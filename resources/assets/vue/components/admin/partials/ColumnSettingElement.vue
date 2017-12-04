<template>
    <div>
    	  <label class="col-sm-4 control-label" :for="columnSetting.name">{{ columnSetting.label }}</label>
        <div class="col-sm-3 pull-left row no-gutters input-group-setting position-relative content-colorpicker" v-for="(columnSettingGroup, keySettings) in columnSetting.group" >

         <!-- Input text -->
          <input v-if="columnSettingGroup.type === 'text'"
                 :class="{'input': true, 'is-danger': errors.has(columnSettingGroup.name) }"
                 :name="columnSettingGroup.name"
                 v-model="columnSettingGroup.value"
                 :placeholder="columnSettingGroup.label"
                 type="text"
                 v-validate="'required'"
                 @change="saveColumnSettings(columnKey)">
          <!-- Input select -->
          <div>
            <b-form-select
                v-if="columnSettingGroup.type === 'select'"
                v-model="columnSettingGroup.value"
                :name="columnSettingGroup.name"
                :options="optionsSelectedBorderStyle"
                @change.native="saveColumnSettings(columnKey)">
            </b-form-select>
          </div>

          <!-- Input color -->
          <input v-if="columnSettingGroup.type === 'color'"
                 v-model="columnSettingGroup.value.hex"
                 v-validate="'required'"
                 class="sketchborder"
                 :class="{'input': true, 'is-danger': errors.has(columnSettingGroup.name) }"
                 :name="columnSettingGroup.name"
                 :placeholder="columnSettingGroup.label"
                 type="text"
                 @click.prevent="toggleSketch"
                 @change="saveColumnSettings(columnKey)">
           <div v-if="columnSettingGroup.type === 'color'"
               class="checkbox-transparent"
          >
            <span>Transparent</span>
            <input type="checkbox"
                   v-model="columnSettingGroup.transparentChecked"
                   :value="columnSettingGroup.transparentChecked"
                   :name="columnSettingGroup.name +'-transparent'"
                   @click="updateColumnSettings(columnKey, columnSettingGroup.name, columnSettingGroup.link, true, columnSettingGroup.transparentChecked )"
            >
          </div>       
          <div v-if="columnSettingGroup.type === 'color'"
               class="icon-remove st-remove-sketch"
               @click.prevent="toggleSketch">
            <i class="glyphicon glyphicon-remove"></i>
          </div>
          <sketch-picker v-if="columnSettingGroup.type === 'color'"
                         v-model="columnSettingGroup.value"
                         class="sketch-picker"
                         @click.native="updateColumnSettings(columnKey, columnSettingGroup.name, columnSettingGroup.link, true,columnSettingGroup.transparentChecked )"
                         @keyup.native="updateColumnSettings(columnKey, columnSettingGroup.name, columnSettingGroup.link, true,columnSettingGroup.transparentChecked )"></sketch-picker>
          <!-- Span General Error -->
          <span v-show="errors.has(columnSettingGroup.name)"
                class="help is-danger">{{ errors.first(columnSettingGroup.name) }}
          </span>
        </div>
    </div>
</template>

<script>
  import ColumnSettingMixin from '../mixins/ColumnSettingMixin.js';

  export default {
    mixins: [ ColumnSettingMixin ]
  }
</script>