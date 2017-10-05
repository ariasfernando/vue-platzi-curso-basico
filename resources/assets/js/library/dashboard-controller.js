var dashboardController = function( customOptions ){

    var options = $.extend({
        selectors:{
            campaignList: "table.campaign-list",
            deleteCampaign: ".actions .delete",
            cloneCampaign: ".actions .clone",
            favoriteCampaign: ".fav .favorite",
            showHtmlCampaign: ".actions .html-code",
            showPlainTextCampaign: ".actions .plaintext",
            goEdit: ".actions .edit",
            goProof: ".actions .proof",
            goPublicView: ".actions .public-view"
        }
    }, customOptions );

    var spinner = new Application.utils.spinner();

    var _this = this;

    /*
     | Get options.
     | @return: data object.
     */
    this.getOptions = function() {
        return options;
    };

    /*
     | Get spinner.
     | @return: data object.
     */
    this.getSpinner = function() {
        return spinner;
    };

    this.doClone = function( element ){
        var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");

        if( campaignId ){
            // Show spinner
            spinner.show();
            var campaign = new campaignController( campaignId );
            // Delete Campaign
            campaign.clone(function(){
                spinner.hide();
            });
        }
    };

    this.doFavorite = function(element){
      var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");

      if (campaignId){
        // Show spinner
        spinner.show();
        var campaign = new campaignController(campaignId);
        // Delete Campaign
        campaign.favorite(function(){
          spinner.hide();
        });
      }
    };
    this.goEdit = function( element ){
        var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");

        if( campaignId ){
            window.location.href = Application.globals.baseUrl + "/campaign/edit/" + campaignId;
        }
    };

    this.goProof = function( element ){
        var token = $(element).attr("data-proof-token");

        if( token ){
            var win = window.open(Application.globals.baseUrl + "/proof/review/" + token, '_blank');
            win.focus();
        }
    };

    this.goPublicView = function( element ){
        var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");
        if( campaignId ){
            var campaign = new campaignController( campaignId );
            campaign.showPreview();
        }
    };

    this.doShowHtml = function( element ){
        // Get Campaign Id
        var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");

        if( campaignId ){
            // Show Spinner
            spinner.show();

            // Show html Modal
            var campaign = new campaignController( campaignId );
            campaign.showHtml(function(){
                // Hide spinner after call
                spinner.hide();
            });
        }
    };

    this.doShowPlainText = function( element ){
        // Get Campaign Id
        var campaignId = $(element).parents("[data-campaign]").attr("data-campaign");

        if( campaignId ){
            // Show Spinner
            spinner.show();

            // Show html Modal
            var campaign = new campaignController( campaignId );
            campaign.showPlaintext(function(){
                // Hide spinner after call
                spinner.hide();
            });
        }
    };

    this.init = function(){

        // Set Events
        $( document )
            // Delete campaign.
            .on("click", options.selectors.deleteCampaign, function(){
                _this.doDelete( this );
                return false;
            })
            // Clone Campaign
            .on("click", options.selectors.favoriteCampaign, function(){
                _this.doFavorite( this );
                return false;
            })
            // Clone Campaign
            .on("click", options.selectors.cloneCampaign, function(){
                _this.doClone( this );
                return false;
            })
            // Show HTML code
            .on("click", options.selectors.showHtmlCampaign, function(){
                _this.doShowHtml( this );
                return false;
            })
            // Show Plaintext
            .on("click", options.selectors.showPlainTextCampaign, function(){
                _this.doShowPlainText( this );
                return false;
            })
            // Go to edit campaign
            .on("click", options.selectors.goEdit, function(){
                _this.goEdit( this );
                return false;
            })
            // Go to proof
            .on("click", options.selectors.goProof, function(){
                _this.goProof( this );
                return false;
            })
            // Go to public path campaign
            .on("click", options.selectors.goPublicView, function(){
                _this.goPublicView( this );
                return false;
            });
    };
};
