<template>
  <div class="modal-eloqua-upload">
    <h4>Upload to {{ espProviderConfig.title }}</h4>
    <div v-if="uploadedSuccessfully" class="response-message response-message-success alert alert-success beta-alert beta-alert-success">
      Email successfully uploaded to {{ espProviderConfig.title }}. <a :href="$_app.config.baseUrl" class="allow-exit">View dashboard</a>.
    </div>
    <form name="upload-api-form" class="upload-api-form">
      <div class="form-group">
        <label for="filename">Filename (extension will be added automatically by stensul)</label>
        <input type="text" class="form-control filename" name="filename" value=""
            placeholder="Enter a name for your campaign" data-validation='{ "required":"true" }'
            v-model="filename"/>
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input type="text" id="subject" class="form-control subject" name="subject" value=""
            placeholder="Enter the subject for your campaign" data-validation='{ "required":"true" }'
            v-model="subject"/>
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
    <div>
      <a target="_blank" type="button" class="btn beta-btn-primary" @click="uploadEmail">Upload</a>
    </div>
  </div>
</template>

<script>

  import apiService from '../../../../services/api';

  export default {

    data () {
      return {
        filename: '',
        subject: '',
        uploadedHistory: {},
        uploadedSuccessfully: false,
      }
    },
    computed: {
      campaign () {
        return this.$store.state.campaign.campaign;
      },
    },
    props: {
      espProviderConfig: {
        type: Object
      }
    },
    methods: {
      uploadEmail () {
        const data = {
          campaign_id: this.campaign.campaign_id,
          api_driver: this.espProviderConfig.class,
          use_oauth: this.espProviderConfig.use_oauth,
          access_token: this.espProviderConfig.token,
          filename: this.filename,
          subject: this.subject
        }
        this.$store.commit("global/setLoader", true);

        apiService.uploadEmail(data).then((response) => {
          this.uploadedSuccessfully = true;
          this.updateUploadedTable();
          this.$store.commit("global/setLoader", false);
        },(error) => {
          this.$store.commit("global/setLoader", false);
          this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          )}
        ); 
      },
      updateUploadedTable () {
        apiService.uploadedHistory(this.campaign.campaign_id).then((response) => this.uploadedHistory = response);
      }
    },
    created () {
      this.updateUploadedTable();
    }
  };
</script>

<style lang="less" scoped>

</style>