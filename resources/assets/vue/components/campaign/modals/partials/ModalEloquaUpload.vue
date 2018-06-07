<template>
  <div class="modal-eloqua-upload">
    <h4>Upload to {{ espProviderConfig.title }}</h4>

    <div class="modal-container-inner">
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
    </div>
    <div class="modal-footer">
      <a target="_blank" type="button" class="btn beta-btn-primary pull-right" @click="uploadEmail">Upload</a>
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
        oauthResponse: false,
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
      openOauthModal(data) {
        this.oauthResponse = false;
        var popup = window.open( this.$_app.config.baseUrl + '/api/oauth', 'login_popup',
            'height=700,width=800,status=0,location=0,toolbar=0,top=50,left=200');

        // setTimeout(function () {
        //   if (!popup || popup.outerHeight === 0) {
        //     var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
        //     $campaignUploadModal.find('.response-message-popup')
        //       .html("Popup Blocker detected. Please add this site to your exceptions list and reload this page.")
        //       .slideDown();
        //     setTimeout(function() {
        //         $campaignUploadModal.find('.response-message-popup').slideUp();
        //     }, 6000);
        //   }
        // }, 500);

        // var timer = setInterval(function() {
        //   if (popup.closed) {
        //       clearInterval(timer);
        //       if (!this.oauthResponse) {
        //         $( elem ).parent().removeClass("spinner");
        //         $( elem ).removeClass("ajax-loader-small").removeAttr("disabled","disabled");
        //       }
        //   }
        // }, 200);

        return false;
      },
      oauthCallback() {
        //TODO: Set access_token
      },
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

        if (data.use_oauth) {
          this.openOauthModal(data);
        }
        
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