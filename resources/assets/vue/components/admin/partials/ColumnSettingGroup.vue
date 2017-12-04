<template>
    <div>
        <label class="col-sm-7 control-label" :for="columnSetting.name">{{ columnSetting.label }}</label>
        <div class="col-sm-5 position-relative content-colorpicker">

          <!-- Input Text -->
          <input v-if="columnSetting.type === 'text'"
                 v-model="columnSetting.value"
                 v-validate="'required'"
                 :class="{'input': true, 'is-danger': errors.has(columnSetting.name) }"
                 :name="columnSetting.name"
                 :placeholder="columnSetting.label"
                 type="text"
                 @change="saveColumnSettings(columnKey)">

          <!-- Input color -->
          <input v-if="columnSetting.type === 'color'"
                 v-model="columnSetting.value.hex"
                 v-validate="'required'"
                 class="sketchbackground"
                 :class="{'input': true, 'is-danger': errors.has(columnSetting.name) }"
                 :name="columnSetting.name"
                 :placeholder="columnSetting.label"
                 type="text"
                 @click.prevent="toggleSketch"
                 @change="saveColumnSettings(columnKey)">

          <div v-if="columnSetting.type === 'color'"
               class="icon-remove st-remove-sketch"
               @click.prevent="toggleSketch">
            <i class="glyphicon glyphicon-remove"></i>
          </div>
          <div v-if="columnSetting.type === 'color'"
               class="checkbox-transparent"
          >
            <span>Transparent</span>
            <input type="checkbox"
                   v-model="columnSetting.transparentChecked"
                   :value="columnSetting.transparentChecked"
                   :name="columnSetting.name +'-transparent'"
                   @click="updateColumnSettings(columnKey, columnSetting.name, columnSetting.link, false, columnSetting.transparentChecked )"
            >
          </div>
          <sketch-picker v-if="columnSetting.type === 'color'"
                         v-model="columnSetting.value"
                         class="sketch-picker"
                         @click.native="updateColumnSettings(columnKey, columnSetting.name, columnSetting.link, false, columnSetting.transparentChecked )"
                         @keyup.native="updateColumnSettings(columnKey, columnSetting.name, columnSetting.link, false, columnSetting.transparentChecked )"
                         ></sketch-picker>

          <!-- Span General Error -->
          <span v-show="errors.has(columnSetting.name)"
                class="help is-danger">{{ errors.first(columnSetting.name) }}
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