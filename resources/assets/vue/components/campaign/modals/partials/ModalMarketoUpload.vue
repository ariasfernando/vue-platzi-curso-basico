<template>
  <div class="modal-upload">
    <h4>Upload to {{ espProviderConfig.title }}</h4>

    <div class="modal-container-inner">
      <div v-if="uploadedSuccessfully" class="response-message response-message-success alert alert-success beta-alert beta-alert-success">
        Email successfully uploaded to {{ espProviderConfig.title }}. <a :href="$_app.config.baseUrl" class="allow-exit">View dashboard</a>.
      </div>
      <div v-if="uploadedError" class="response-message response-message-success alert alert-danger beta-alert beta-alert-danger">
        {{ uploadedError }} <a :href="$_app.config.baseUrl" class="allow-exit">View dashboard</a>.
      </div>
      <form name="upload-api-form" class="upload-api-form">
        <div class="form-group">
          <label for="filename">Name</label>
          <input type="text" class="form-control filename" name="filename" value=""
              placeholder="Enter a name for your campaign" data-validation='{ "required":"true" }'
              v-model="filename"/>
        </div>
        <div v-if="espProviderConfig.folder_by_permission && folders.length" class="form-group">
          <label>Folder to upload</label>
          <stui-select
            v-model="folder"
            :list="folders"
            placeholder="Choose a folder"
            class="width-full" />
        </div>
        <div class="uploaded-data" data-info="filename">
          <label>File upload history:</label>
          <table class="table table-condensed">
            <thead>
              <tr>
                <th>Date</th>
                <th>Filename</th>
                <th>stensul User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in uploadedHistory">
                <td>{{file.date}}</td>
                <td>{{file.filename}}</td>
                <td>{{file.user}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <a target="_blank" type="button" class="btn beta-btn-primary pull-right" @click="uploadEmail">Upload</a>
    </div>

  </div>
</template>

<script>

import apiService from '../../../../services/api';

export default {
  props: {
    espProviderConfig: {
      type: Object,
      default() {},
    },
  },
  data() {
    return {
      filename: '',
      subject: '',
      uploadedHistory: {},
      uploadedError: '',
      uploadedSuccessfully: false,
      folder: '',
      folders: {},
      marketoConfig: {},

    };
  },
  computed: {
    campaign() {
      return this.$store.state.campaign.campaign;
    },
  },
  created() {
    if (this.espProviderConfig.folder_by_permission) {
      const folders = [];
      let n = 0;
      let folderByPermission = [];

      folderByPermission = Object.entries(this.espProviderConfig.folder_by_permission);

      folderByPermission.forEach((folder) => {
        if (this.$_app.config.permissions.indexOf(folder[0]) >= 0) {
          folders[n++] = {
            value: folder[1].folder_id,
            label: folder[1].folder_name,
          };
        }
      });
      this.folders = folders;
    }
    this.updateUploadedTable();
  },
  methods: {
    uploadEmail() {
      const data = {
        campaign_id: this.campaign.campaign_id,
        api_driver: this.espProviderConfig.class,
        filename: this.filename,
        subject: this.subject,
        folder_id: this.folder,
      };
      this.$store.commit('global/setLoader', true);

      this.uploadedSuccessfully = false;
      this.uploadedError = '';
      apiService.uploadEmail(data).then(() => {
        this.uploadedSuccessfully = true;
        this.updateUploadedTable();
        this.$store.commit('global/setLoader', false);
      }, (error) => {
        this.$store.commit('global/setLoader', false);
        let message = 'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.';
        if (_.has(error, 'body') &&  _.has(error.body, 'message')) {
          message = error.body.message;
        }
        this.uploadedError = message;
      });
    },
    updateUploadedTable() {
      apiService.uploadedHistory(this.campaign.campaign_id).then((response) => this.uploadedHistory = response);
    },
  },
};
</script>

<style lang="less">
  .el-scrollbar {
      z-index: 99999!important;
  }
  .el-select-dropdown {
    z-index: 99999!important;
  }
</style>
