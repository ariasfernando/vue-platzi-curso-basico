/*
 * == Fetch URL ==
 * Used in image editor modal to download an image from a url.
 */

/*
 * -- Global vars --
 * These lines are necessary.
 */
var globalMasterImageEditor = globalMasterImageEditor || {};
globalMasterImageEditor.plugins = globalMasterImageEditor.plugins || {};

// Tracking image function
globalMasterImageEditor.plugins.fetchUrl = function( masterImageEditor ){

    // Ugly hack to fix error: "Uncaught RangeError: Maximum call stack size exceeded".
    // $.fn.modal.Constructor.prototype.enforceFocus = function() {};

    if( !masterImageEditor ){
        return false;
    }

    var options = null;
    var $modalEditorContent = masterImageEditor.getModalContent();
    var spinner = new Application.utils.spinner();
    var $pluginTab = null;
    var $urlField = null;
    var _this = this;

    /*
     * == Build Tab ==
     * Create and append Fetch URL tab into image editor modal.
     */
    this.buildTab = function(){
        // Remove fetch tab created in modal view
        if( $modalEditorContent.find("."+options.tabClass) ){
            $modalEditorContent.find("."+options.tabClass).remove();
        }
        // Build new tab
        $pluginTab = $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="true">');
        $pluginTab.find('a')
            .attr("href","#"+options.tabContentId)
            .addClass(options.tabClass)
            .append('<i class="'+ options.iconClass +'"></i>' + options.tabTitle);
        // Append tab
        return $pluginTab;
    };

    /*
     * == Build Tab Content ==
     * Create and append tab content into image editor modal.
     */
    this.buildTabContent = function(){
        // Remove fetch tab created in modal view
        if( $modalEditorContent.find("."+options.tabContentClass) ){
            $modalEditorContent.find("."+options.tabContentClass).remove();
        }
        // Build tab content
        var $tabContent = $("<div>");
        $tabContent
            .addClass('tab-pane modal-mpf-row file-tab-section ' + options.tabContentClass)
            .attr("id",options.tabContentId)
            .attr("role","tabpanel");
        // Build input and button
        $tabContent.append('<div class="input-group">');
        // Build input
        var $input = $('<input type="text" value=""/>');
        $input
            .addClass("url-format exclude-from-data")
            .attr("id","https://www.example.com")
            .attr("name","url-to-fetch")
            .attr("placeholder","https://www.example.com")
            .data("validation",{ "url":true });
        // Append 
        $tabContent.find(".input-group")
            .append($input)
            .append('<button id="fetch-url-btn" class="btn btn-default fetch-url-btn"><i class="'+options.buttonIconClass+'"></i>'+options.buttonText+'</button>');

        // Set url field
        $urlField = $input;

        return $tabContent;
    };

    /*
     * == Errors ==
     * set error on field
     */
    this.setError = function($urlField, error){
        $urlField
            .addClass("error")
            .after('<label class="error">'+ error +'</label>');
    };
    // Clear field error
    this.clearError = function($urlField){
        $urlField.removeClass("error");
        $urlField.parent().find("label.error").remove();
    };

    /*
     * == Validate ==
     */
    this.validate = function(){
        _this.clearError($urlField);

        // Validate required field
        if( $urlField.val() === "" ){
            _this.setError($urlField,options.msgRequiredField);
            masterImageEditor.hideImageLoading();
            return false;
        }

        // Validate url format
        if( !Application.utils.validate.validateUrlField($urlField[0]) ){
            _this.setError($urlField,options.msgValidUrlFormat);
            masterImageEditor.hideImageLoading();
            return false;
        }

        return true;
    };

    /*
     * == Apply image ==
     * Set cropit image source and close modal
     */
    this.apply = function(imagePath){
        // Set cropit image source
        masterImageEditor.getModalContent().find(".init-cropper").cropit('imageSrc', Application.globals.campaignImageUrl + imagePath );
        // Create temporal image
        var tmpImg = new Image();
        tmpImg.src = Application.globals.campaignImageUrl + imagePath;
        // on image load
        $(tmpImg).on("load",function(){
            _this.closeModal();
        });
    };

    /*
     * == Download Image ==
     */
    this.downloadImage = function(){
        var downloadCall = Application.utils.doAjax("/campaign/upload-image",{
            data: {
                campaign_id: campaignManager.getCampaignId(),
                data_image: $urlField.val()
            }
        });

        downloadCall.done(function(response){
            if( response.path ){
                options.onDownload(response.path);
            }else{
                masterImageEditor.hideImageLoading();
                masterImageEditor.displayMessage(
                    options.msgDownloadFail,
                    'danger'
                );
            }
        });

        downloadCall.fail(function(){
            masterImageEditor.hideImageLoading();
            masterImageEditor.displayMessage(
                options.msgDownloadFail,
                'danger'
            );
        });        
    };

    /*
     * == Submit ==
     */
    this.submit = function(){
        masterImageEditor.showImageLoading();

        if( _this.validate() ){
            _this.downloadImage($urlField.val());
        }
    };

    /*
     * == Close modal ==
     */
    this.closeModal = function(){
        $( options.modalId ).modal('hide');
    };

    /*
     * == Init ==
     */
    this.init = function( params ){
        options = $.extend({
            // Tab.
            tabTitle: "Fetch From URL",
            tabClass: "btn-fetch-url",
            iconClass: "glyphicon glyphicon-picture",
            tabContainerSelector: ".nav.nav-tabs",
            // Tab content.
            tabContentParentSelector: "#tab-content",
            tabContentClass: "fetch-url",
            tabContentId: "fetch-url",
            buttonText: "Fetch",
            buttonIconClass: "glyphicon glyphicon-cloud-download",
            // Messages
            msgRequiredField: Application.utils.validate.messages.required.default,
            msgValidUrlFormat: Application.utils.validate.messages.url,
            msgDownloadFail: "An error ocurred trying to download the image, please try later.",
            // Events: onDownload
            onDownload: function( imagePath ){
                _this.apply(imagePath);
            }
        }, params );

        // Build tab & content
        $modalEditorContent.find(options.tabContainerSelector).append(_this.buildTab());
        $modalEditorContent.find(options.tabContentParentSelector).append(_this.buildTabContent());
        // Set button events
        $modalEditorContent.on("click","#fetch-url-btn",function(){
            _this.submit();
            return false;
        });
    };

    return this;
};