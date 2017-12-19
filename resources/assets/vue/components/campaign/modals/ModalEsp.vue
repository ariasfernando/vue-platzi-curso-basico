<template>
  <transition name="modal" v-if="modalEsp">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container modal-esp">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>
          <slot name="body">
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
          </slot>
          <slot name="footer">
            <div>
              <a target="_blank" type="button" class="btn beta-btn-primary" @click="uploadEmail">Upload</a>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';
  import configService from '../../../services/config';
  import apiService from '../../../services/api';

  export default {
    components: {
      BootstrapVue
    }, 
    data () {
      return {
        espProviderConfig: {},
        uploadedHistory: {},
        filename: '',
        subject: '',
        uploadedSuccessfully: false,
      }
    },
    computed: {
      modalEsp () {
        return this.$store.state.campaign.modalEsp;
      },
      campaign () {
        return this.$store.state.campaign.campaign;
      },
    },
    methods: {
      close () {
        this.$store.commit("campaign/toggleModal", 'modalEsp');
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
      if (this.campaign.library_config.espProvider) {
        configService.getConfig('api.' + this.campaign.library_config.espProvider).then((response) => this.espProviderConfig = response);
        this.updateUploadedTable();
      }
    }
  };
</script>

<style lang="less" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-confirm{
    .modal-content{
      border-radius: 0px;
      padding: 15px;

      .modal-footer{
        border-top: 1px solid #dddddd;
        padding: 15px 0px 0px 0px;
      }

      .modal-body{
        padding: 10px 0px 15px;
        font-weight: 300;
        font-family: 'Open Sans', Arial, sans-serif;
      }
    }
  }
  .modal-container {
    width: 750px;
    height: 632px;
    overflow: scroll;
    background-color: #fff;
    border-radius: 0;
    box-shadow: none;
    transition: all .3s ease;

    input[type=text]{
      font-family: 'Open Sans', Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #666666;
      box-shadow: none;
      border-radius: 2px;
      height: 36px;

      &:focus {
        border: 1px solid #DDDDDD;
      }
    }

    textarea {
      width: 100%;
      height: 500px;
      border: 1px solid #ccc;
      font-family: monospace, serif;
    }

    .btn-copy {
      height: 34px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    .btn-send {
      height: 36px;
    }

    p.info {
      font-weight: 300;
      color: #999999;
      font-size: 11px;
      margin-top: 5px;
    }
    label.info {
      margin-left: 4px;
    }
  }

  .modal-esp {

    .close{

      &:focus{
        outline: none;
        background: none;
      }
    }
  }
</style>