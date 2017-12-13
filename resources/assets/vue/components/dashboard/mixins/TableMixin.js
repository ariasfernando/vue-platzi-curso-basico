import ColumnSort from '../ColumnSort.vue';
import Pagination from '../../common/Pagination.vue';
import Modal from '../../common/Modal.vue';
import CampaignTag from '../CampaignTag.vue';

export default {
  components: {
    ColumnSort,
    Pagination,
    Modal,
    CampaignTag
  },
  data: function() {
    return {
      sortKey: 'updated_at',
      reverse: false,
      showModal: false,
      showPreview: false,
      showModalEdit: false,
      selectedCampaignId: null,
      baseUrl: Application.globals.baseUrl,
      widthPreview: Application.globals.emailWidth || 660,
      previewSrc: null
    }
  },
  props: {
    campaigns: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    templating: {
      type: Boolean,
      default: false
    },
    tags: {
      type: Array
    },
    terms: {
      type: Array
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    showTags: function() {
      return this.config.enable_tagging;
    },
    enableLocking: function() {
      return this.config.locking;
    },
    enableFavorite: function() {
      return this.config.enable_favorite_template;
    },
    accessFavorite: function() {
      return Application.globals.permissions.indexOf('access_favorites') >= 0;
    },
    search: function() {
      return this.tags.concat(this.terms).join('~~').toLowerCase().split('~~');
    }
  },
  methods: {
    clone: function(campaignId) {

      if (campaignId) {
        // Show spinner
        this.$store.commit("global/setLoader", true);
        var request = Application.utils.doAjax("/campaign/clone", {dataType: "json", data: {campaign_id: campaignId}});

        let _this = this;
        // Ajax: On Success
        request.done(function(response){
          // check if the ajax returns a campaign_id and isn't the origin ID
          if (response.campaign_id && response.campaign_id != campaignId) {
            // Redirect to edit view.
            window.location.href = Application.globals.baseUrl + "/campaign/edit/" + response.campaign_id;
          } else {
            // Display alert on error
            _this.$store.commit("global/setLoader", false);
            _this.$root.$toast(
              'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
              {className: 'et-error'}
            );
          }
        });

        // Ajax: On Fail
        request.fail(function(){
          _this.$store.commit("global/setLoader", false);
          _this.$root.$toast(
            'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
            {className: 'et-error'}
          );
        });
      }
    },
    addSearchTag(tag) {
      if (this.config.enable_search === true) {
        this.$emit('add-search-tag', tag);
      }
    },
    askToDeleteCampaign(campaignId) {
      this.selectedCampaignId = campaignId;
      this.showModal = true;
    },
    askToEditCampaign(campaignId) {
      this.selectedCampaignId = campaignId;
      this.showModalEdit = true;
    },
    changePage(page) {
      this.$emit('change-page', page, this.type);
    },
    confirmDeleteCampaign() {
      $.post(Application.globals.baseUrl + '/campaign/delete', {
        campaign_id: this.selectedCampaignId
      }, function(campaigns) {
        this.selectedCampaignId = null;
        this.showModal = false;
        this.$emit('refresh-campaigns', this.type);
      }.bind(this), 'json');
    },
    confirmEditCampaign() {
      window.location.href = this.$_app.config.baseUrl + '/campaign/edit/' + this.selectedCampaignId;
    },
    isFavorite: function(data) {
      if (!data.favorite) {
        var star ='<i class="glyphicon glyphicon-star-empty"aria-hidden="true" style="color:#999999;"></i>';
      } else {
        var star ='<i class="glyphicon glyphicon-star" style="color:#eac827" aria-hidden="true"></i>';
      }
      return star;
    },
    doFavorite: function(campaignId) {

      let request = Application.utils.doAjax( "/campaign/favorite", { dataType: "json", data: { campaign_id: campaignId }});
      let _this = this;
      _this.$store.commit("global/setLoader", true);

      // Ajax: On Success
      request.done(function(response){
        _this.$emit('refresh-campaigns', _this.type);
        _this.$store.commit("global/setLoader", false);
      });

      // Ajax: On Fail
      request.fail(function(err) {
        _this.$store.commit("global/setLoader", false);
        _this.$root.$toast(
          'Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.',
          {className: 'et-error'}
        );
      });

    },
    highlightTag: function(tag) {
      if (this.config.search_settings.highlight_matches === true) {
        for (var i = 0; i < this.search.length; i++) {
          if (this.search[i].toLowerCase() == tag.toLowerCase()) {
            return true;
          }
        }
        for (var i = 0; i < this.terms.length; i++) {
          if (this.terms[i].length > 0) {
            var re = new RegExp('('+this.terms[i]+')', 'gi');
            if (re.test(tag)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    sortBy: function(sortKey) {
      this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;
      this.$emit('apply-sort', sortKey, this.reverse == true ? 'asc' : 'desc', this.type, (this.sortKey != sortKey));
      this.sortKey = sortKey;
    },
    prepareOutput: function(value, field) {
      var search = this.terms;
      if (this.config.search_settings.highlight_matches === true && this.config.search_settings.fields_to_search.indexOf(field) > -1) {
        for (var i = 0; i < search.length; i++) {
          value = value.replace(new RegExp('('+search[i]+')', 'gi'), '%%%$1###');
        }
        value = value.replace(/%%%/g, '<span class="highlight">');
        value = value.replace(/###/g, '</span>');
      }
      return value;
    },
    lockCampaign: function(campaign_id, page) {
      var data = {
        campaign_id: campaign_id
      };
      var lockCampaign = Application.utils.doAjax('/campaign/force-lock', {
        data: data,
        error: function(xhr) {
          if (xhr.status == 409) {
              Application.utils.alert.display('', 'Another user is editing this campaign [' + xhr.responseText + ']' , 'warning');
          }
        }
      });

      var vm = this;
      lockCampaign.done(function(data) {
        vm.$emit('change-page', page, vm.type);
      });
    },
    unlockCampaign: function(campaign_id, page) {
      var data = {
        campaign_id: campaign_id
      };
      var unlockCampaign = Application.utils.doAjax('/campaign/unlock-forced', {data: data});
      var vm = this;
      unlockCampaign.done(function(data) {
        vm.$emit('change-page', page, vm.type);
      });
    },
    resizePreviewFrame: function() {
      var $emailBody = $('.dashboard-campaign-preview').find("iframe").contents().find('.email-body');
      var height = $emailBody.height() > 200 ? $emailBody.height() : 150;
      $("#email-preview-iframe").height(height);
    },
    togglePreview: function(mode) {
      switch(mode) {
        case 'mobile': this.widthPreview = Application.globals.emailMobileWidth || 660;
        break;
        default: this.widthPreview = Application.globals.emailWidth || 480;
      }
      _this = this;
      // Give some time to the browser to resize.
      setTimeout(function() {
        _this.resizePreviewFrame();
      }, 10);
    },
    closePreview: function() {
      this.showPreview = false;
      this.widthPreview = Application.globals.emailWidth;
    },
    sendPreview: function() {

      var $modal = $('.dashboard-campaign-preview');
      var $sendPreviewForm = $modal.find("#send-preview-form");

      // Validate Emails form
      if (Application.utils.validate.validateForm($sendPreviewForm[0])) {

        $modal.find(".btn-send").addClass("ajax-loader-small").attr("disabled", "disabled");
        $modal.find(".btn-send").parent().removeClass("success").addClass("spinner");

        var data = {
          campaign_id: this.selectedCampaignId,
          mail: $sendPreviewForm.find("input[name=send-preview-to]").val()
        };

        var sendPreviewRequest = Application.utils.doAjax("/campaign/send-preview", {
          type: "POST",
          data: data
        });

        sendPreviewRequest.done(function(response){

          $modal.find('label.error').remove();
          if (response.processed) {
            // Display success icon.
            if (!$modal.find(".btn-send .glyphicon-ok").length) {
              $modal.find(".btn-send").append(' <i class="glyphicon glyphicon-ok status-icon"></i>');
            }
            $modal.find(".btn-send").parent().removeClass("spinner").addClass("success");
            $modal.find(".btn-send").find('.status-icon').animate({
              opacity: 1
            });
          } else {
            $modal.find(".btn-send")
              .parent()
              .removeClass("spinner")
              .find("[name=send-preview-to]")
              .addClass("error")
              .next()
              .after('<label class="error">We couldn\'t find a valid email address.</label>');
          }
        });

        sendPreviewRequest.fail(function(){
          // On error display alert
          $modal.find(".send-preview")
            .prepend('We couldn\'t send your preview, please try again.')
            .find(".alert").slideDown();
        });

        sendPreviewRequest.always(function(){
          // Remove loader.
          $modal.find(".btn-send").removeClass("ajax-loader-small").removeAttr("disabled", "disabled");
        });
      }
    },

  }
};