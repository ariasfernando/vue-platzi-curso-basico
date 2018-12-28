<template>
  <section class="col-xs-12 section-container">
    <div class="row">
      <div class="col-xs-12">
        <h2 class="pull-left">Global Settings</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="row" v-if="ready && settings.length">
          <div class="col-xs-12">
            <div class="table-responsive">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" id="admin-library"
                     class="table table-bordered table-striped sortable data-list" v-bind:class="{ loading: loading }">
                <thead>
                <tr>
                  <th width="20%">
                    Name
                  </th>
                  <th width="80%">
                    Value
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="setting in settings">
                  <td :title="setting.name">{{ setting.name }}</td>
                  <td>
                      <toggle-button v-if="setting.properties.type == 'toogle'" 
                        class="pull-left" 
                        :value="setting.value == 1" 
                        id="setting" 
                        @change="updateToogle(setting.key, setting.value)">
                      </toggle-button>
                      <el-input v-if="setting.properties.type == 'textarea'"
                        type="textarea"
                        class="setting-textarea"
                        :rows="5"
                        placeholder="Please input"
                        :value="JSON.stringify(setting.value, null, 2)" 
                        @change="updateTextarea($event, setting.key)">
                      </el-input>
                      <div v-if="setting.properties.type == 'font'" class="btn btn-default btn-create pull-left">
                        <router-link to="/fonts" class="btn-create"><i class="glyphicon glyphicon-edit"></i> Edit setting</router-link>
                      </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row" v-if="ready && !settings.length">
          <div class="col-xs-12">
            There are no settings created or you don't have permission to access any,
            check the roles or create a new one.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import settingService from '../../services/setting'
  import _ from 'underscore-contrib'

  export default {
    name: 'globalSettings',
    data: function () {
      return {
        ready: false,
      }
    },
    computed: {
      settings() {
        return this.$store.getters["setting/settings"];
      },
    },
    methods: {
      fetchSettings () {
        this.loading = true;
        settingService.fetchSettings()
          .then((response) => {
            this.$store.commit("setting/setSettings", response);
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      },
      updateToogle(settingKey, value) {
        let newValue = value ? 0 : 1;
        this.saveSetting(settingKey, newValue);
      },
      updateTextarea(event, settingKey) {
        let newValue = JSON.parse(event);
        this.saveSetting(settingKey, newValue);
      },
      saveSetting (key, value) {
        this.loading = true;
        let settingJson = {
          key: key,
          value:value
        }
        settingService.saveSetting(settingJson)
          .then((response) => {
            this.fetchSettings();
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      }
    },
    created () {
      this.fetchSettings();
    },
  };
</script>

<style lang="less">
  @import '../../less/admin';

  .setting-textarea {
    font-size: 11px;
  }
</style>