<template>
  <div class="component-settings">
    <h4>Default Settings</h4><hr>
    <div class="default-settings">
      <form class="form-horizontal">
        <div class="form-group" v-for="setting in component.settings">
          <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
          <div class="col-sm-8">
            <input v-if="setting.type == 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                   :name="setting.name" type="text" :placeholder="setting.label">
            <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>
          </div>
        </div>
      </form>
    </div>

    <h4>User Settings</h4><hr>
    <div class="user-settings">
      <form class="form-horizontal">
        <div v-for="setting in component.userSettings">

          <div class="form-group">
            <label class="col-sm-4 control-label" :for="setting.name">{{ setting.label }}</label>
            <div class="col-sm-8">

              <input v-if="setting.type == 'text'" v-model="setting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(setting.name) }"
                     :name="setting.name" type="text" :placeholder="setting.label">
              <span v-show="errors.has(setting.name)" class="help is-danger">{{ errors.first(setting.name) }}</span>

              <switches v-if="setting.type == 'switch'" v-model="setting.value" :selected="setting.value"></switches>

            </div>
          </div>

          <hr v-if="setting.options.length">

          <div v-if="setting.options.length">
            <div v-for="childSetting in setting.options" class="form-group setting-options">
              <label class="col-sm-4 control-label" :for="childSetting.name">{{ childSetting.label }}</label>
              <div class="col-sm-8">

                <input v-if="childSetting.type == 'text'" v-model="childSetting.value" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(childSetting.name) }"
                       :name="childSetting.name" type="text" :placeholder="childSetting.label">
                <span v-show="errors.has(childSetting.name)" class="help is-danger">{{ errors.first(childSetting.name) }}</span>

                <switches v-if="childSetting.type == 'switch'" v-model="childSetting.value" :selected="childSetting.value"></switches>

              </div>
            </div>
          </div>
        </hr>

      </form>
    </div>

  </div>
</template>

<script>

  import Switches from 'vue-switches';

  export default {
    props: ['component'],
    components: {
      Switches
    }
  }
</script>