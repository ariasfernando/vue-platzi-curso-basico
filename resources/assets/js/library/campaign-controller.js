/*
 * Campaign Controller
 * delete | clone | displayModalCode | showHtml | showPlaintext
 */
function campaignController( campaignId ){
    if( !campaignId )
        return false;

    // Set campaign id
    this.campaignId = campaignId;

    // Delete campaign
    this.delete = function( callBack ){
        var request = Application.utils.doAjax( "/campaign/delete", { data: {
            campaign_id: this.campaignId,
            dataType: 'json'
        }});
        var campaign = this;

        // Ajax: On Success
        request.done(function( response ){
            if( response.success ){
                Application.utils.alert.display("","Campaign successfully deleted.","success");
            }else if( response.campaign_lock ){
                Application.utils.alert.display("Warning!","Another user is editing this campaign.","warning");
            }else{
                Application.utils.alert.display("Error:","An error occurred while trying to delete the campaign, please try again later.","danger");
            }
        });

        // Ajax: On Fail
        request.fail(function(){
            Application.utils.alert.display("Error:","An error occurred while trying to delete the campaign, please try again later.","danger");
        });

        // Ajax: Do Always
        request.always(function(){
            if(callBack){
                callBack();
            }
        });

    }

    // Clone campaign
    this.clone = function( callBack ){
        var request = Application.utils.doAjax( "/campaign/clone", { dataType: "json", data: { campaign_id: this.campaignId }});

        // Ajax: On Success
        request.done(function( response ){
            // check if the ajax returns a campaign_id and isn't the origin ID
            if( response.campaign_id && response.campaign_id != this.campaignId ){
                // Redirect to edit view.
                window.location.href = Application.globals.baseUrl + "/campaign/edit/" + response.campaign_id;
            }else{
                // Display alert on error
                Application.utils.alert.display("Error:","An error occurred while trying to clone the campaign, please try again later.","danger");
                if(callBack){
                    callBack();
                }
            }
        });

        // Ajax: On Fail
        request.fail(function(){
            Application.utils.alert.display("Error:","An error occurred while trying to clone the campaign, please try again later.","danger");
            if(callBack){
                callBack();
            }
        });
    }

    // Display Modal Code
    this.displayModalCode = function( method, callback ){
        // Get content
        var getContentRequest = Application.utils.doAjax("/campaign/" + method, { type: "GET", data:{ campaign_id: this.campaignId }});

        // On success
        getContentRequest.done(function( response ){
            if( response || response === ""){
                // Append content to modal.
                var $modal = $("#modal-dashboard-code");
                $modal.find(".modal-body textarea").empty().text( response );
                // Show modal.
                $modal.modal();
            }else{
                // Show error
                Application.utils.alert.display("Error:","An error occurred, please try again later.","danger");
            }
        });

        // On Fail
        getContentRequest.fail(function(){
            // Show error
            Application.utils.alert.display("Error:","An error occurred, please try again later.","danger");
        });

        // Do Always
        getContentRequest.always(function(){
            if( callback ){
                callback();
            }
        });
    }

    // Get HTML code
    this.showHtml = function( callback ){
        this.displayModalCode( "html", callback );
    }

    // Get Plaintext
    this.showPlaintext = function( callback ){
        this.displayModalCode( "plain-text", callback );
    }

    // Show preview
    this.showPreview = function(){
        var previewModal = new campaignPreview({
            campaignId: this.campaignId,
            sendPreview: false,
            sharePreview: true
        });
        previewModal.open();
    }
}
