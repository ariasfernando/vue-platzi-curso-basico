/*
 * == Campaign preview ==
 */
function campaignPreview( params ){
    var options = $.extend({},{
        modal: "#modal-campaign-preview",
        defaultWidth: 660,
        mobileWidth: 320,
        preview: true,
        sendPreview: true,
        sharePreview: false
    },params);

    var spinner = new Application.utils.spinner();
    var $modal = $(options.modal);
    var _this = this;

    this.campaignId = null;
    this.content = null;

    /*
     * == Get mobile Iframe Height ==
     * Returns iframe height
     */
    this.getMobileIframeHeight = function(){
        var displayHeight = 0;

        switch(options.mobileWidth){
            case 480:
                displayHeight = 791;
            break;
            default:
                displayHeight = 525;
            break;
        }

        return displayHeight;
    };

    /*
     * == Get mobile frame ==
     * Returns mobile frame element.
     */
    this.getMobileFrame = function(){
        var selector = ".mobile-frame"
        if( options.mobileWidth != 320 ){
            selector = selector + "-" + String(options.mobileWidth);
        }

        return $modal.find(selector);
    };

    /*
     * == Get Preview URL ==
     * type param: html || view
     * Return a url.
     */
    this.getPreviewUrl = function(type){
        if( !type || type != "html" ){
            type = "view";
        }

        return Application.globals.baseUrl + "/public/"+type+"/" + this.campaignId;
    };

    /*
     * == Init ==
     */
    this.init = function(){
        if( !options.campaignId ){
            Application.utils.alert.display("", "An error occurred, wrong campaign ID.", "warning");
            return false;
        }

        this.campaignId = options.campaignId;

        // Set modal events
        this.setEvents();

        // Hide preview
        if( !options.preview ){
            $modal.find(".preview-body").hide();
            $modal.find(".nav-tabs").parent().hide();
        }

        // Init Share button
        if(options.sharePreview){
            this.initShare();
        }else{
            // Hide if not active
            $modal.find(".share-preview").hide();
        }

        // Init Send Preview
        if( options.sendPreview ){
            // Init send preview.
            _this.initSendPreview();
        }else{
            // Hide if not active
            $modal.find(".send-preview").hide();
        }

        // Mobile frame class
        if( options.mobileWidth != 320 ){
            $modal.find(".mobile-frame").removeClass("mobile-frame").addClass("mobile-frame-" + String(options.mobileWidth));
        }
    }

    /*
     * == Init Send Preview ==
     */
    this.initSendPreview = function(){
        $modal.find(".btn-send").click(function(){
            $(this)
                .parent()
                .removeClass("success")
                .removeClass("spinner");

            if ($(this).find(".status-icon").length) {
                $(this).find(".status-icon").remove();
            }


            _this.sendPreview();
        });
    };

    this.sendPreview = function(){
        var $sendPreviewForm = $modal.find("#send-preview-form");
        // Validate Emails form
        if (Application.utils.validate.validateForm($sendPreviewForm[0])) {
            $modal.find(".btn-send").addClass("ajax-loader-small").attr("disabled", "disabled");
            $modal.find(".btn-send").parent().removeClass("success").addClass("spinner");
            // At first we must save the campaign.
            var saveCampaign = campaignManager.save({saveHtml: true, validateForms: false});

            // Hide modal if validation is invalid
            if (!saveCampaign) {
                $modal.modal("hide");
                return false;
            }

            // On Save Success
            saveCampaign.done(function (campaignId) {
                // Add loader into button
                // Remove status icon if are someone there
                $modal.find(".btn-send").prev("i.status-icon").remove();
                // Remove alerts before send
                $modal.find(".send-preview .alert").slideUp("fast", function () {
                    $(this).remove();
                });
                // remove error
                $modal.find(".btn-send").parent().find("[name=send-preview-to]").removeClass("error");
                $modal.find(".btn-send").parent().find("label.error").remove();

                // Get extra data
                var data = {};
                if ($sendPreviewForm.find("input[name=send-preview-subject]").length) {
                    data.subject = $sendPreviewForm.find("input[name=send-preview-subject]").val();
                }
                if ($sendPreviewForm.find("input[name=send-preview-to]").length) {
                    data.preheader = $sendPreviewForm.find("input[name=send-preview-preheader]").val();
                }
                // Send Preview Email
                campaignManager.sendPreviewEmail(
                    // Email
                    $sendPreviewForm.find("input[name=send-preview-to]").val(),
                    // Success
                    function (response) {
                        if (response.processed) {
                            // Display success icon.
                            $modal.find(".btn-send").append('<i class="glyphicon glyphicon-ok status-icon"></i>');
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
                                .after('<label class="error">We couldn\'t find a valid email address.</label>');
                        }
                    },
                    // Fail
                    function () {
                        // On error display alert
                        $modal.find(".send-preview")
                            .prepend(errorAlert)
                            .find(".alert").slideDown();
                    },
                    // Always
                    function () {
                        // Remove loader.
                        $modal.find(".btn-send").removeClass("ajax-loader-small").removeAttr("disabled", "disabled");
                    },
                    // Data
                    data
                );
            });
        }
    };

    /*
     * == Init Share Button ==
     * Set preview url as input value and init copy function
     */
    this.initShare = function(){
        // Set preview url
        $modal.find(".share-preview input").val(_this.getPreviewUrl());
        // Init copy button
        $modal.find(".share-preview").on("click","button",function(){
            var input = $modal.find(".share-preview input")[0]
            input.focus();
            input.setSelectionRange(0, input.value.length);
            document.execCommand("copy");
        });
    };

    /*
     * == Set modal events ==
     */
    this.setEvents = function(){
        $modal
            // On modal close
            .on("hidden.bs.modal", function (e) {
                // click tab on modal close.
                $modal.find(".btn-desktop").click();
                $modal.find(".btn-send i").remove();
                $modal.find(".btn-send")
                    .removeClass("ajax-loader-small")
                    .removeAttr("disabled");
                $modal.find(".btn-send").parent().removeClass("spinner success");
            })
            // On modal shown
            .on("shown.bs.modal", function (e) {
                _this.onModalShown();
            })
            // Mobile button click
            .on("click",".btn-mobile",function(){
                if ($(this).parent().hasClass("active")) {
                    return false;
                }
                // Stop animation
                $modal.find(":animated").stop();
                // Animate to mobile view
                _this.animatePreviewToMobile();
            })
            // Desktop button click
            .on("click",".btn-desktop",function(){
                if ($(this).parent().hasClass("active")) {
                    return false;
                }
                // Stop animation
                $modal.find(":animated").stop();
                // Animate to desktop view
                _this.animatePreviewToDesktop();
            });

        // On iframe load
        $modal.find("iframe").on("load",function(){
            if( _this.content ){
                _this.appendContent();
            }else{
                // Show modal
                _this.displayModal();
            }
        });
    };

    /*
     * == Open ==
     */
    this.open = function( content ){
        // Show spinner
        spinner.show();

        if( !options.preview ){
            _this.displayModal();
        }else if( content ){
            _this.content = content;
            $modal.find("iframe").attr("src",Application.globals.baseUrl + "/template/email-preview/" + _this.campaignId );
        }else{
            // Get public view
            $modal.find("iframe").attr("src",_this.getPreviewUrl("html"));
        }
    };

    this.appendContent = function(){
        var $emailLayout = $modal.find("iframe").contents().find("table table.wrapper-table");
        $emailLayout.empty().append(_this.content);

        // Show modal
        _this.displayModal();
    };

    this.displayModal = function(){
        // Show modal
        $modal.modal();
        // Hide Spinner
        spinner.hide();
    };

    /*
     * == On modal shown ==
     * function called on shown modal method
     */
    this.onModalShown = function(){
        // Set iframe dimension
        _this.setIframeDimensions();
    };

    /*
     * == Set iframe dimensions ==
     * Se elements dimensions
     */
    this.setIframeDimensions = function(){
        // Set iframe height
        var $emailBody = $modal.find("iframe").contents().find('.email-body');
        $modal.find("iframe").height($emailBody.height());
        // Set iframe container width
        $modal.find(".iframe-container").width(options.defaultWidth);
    };

    /*
     * == Animate preview to mobile view ==
     */
    this.animatePreviewToMobile = function(){
        var displayHeight = _this.getMobileIframeHeight();
        var $iframeContainer = $modal.find(".iframe-container");

        // Animate container to mobile height
        $modal.find(".preview-container").animate({
            height: _this.getMobileFrame().height()
        });

        // Animate iframe to mobile size
        $iframeContainer.animate({
            width: options.mobileWidth,
            height: displayHeight,
            top: 60
        }, function(){
            var emailHeight = $modal.find("iframe").contents().find("body").height();
            var iframeHeight = displayHeight;

            if (emailHeight > iframeHeight) {
                iframeHeight = emailHeight;
            }

            $modal.find("iframe").animate({
                height: iframeHeight
            }, function () {
                // If the height of the email is greater than the frame height add scrollbars.
                $iframeContainer.css("overflow-y", "auto");
            });
        });

        // Animate mobile frame to opacity 1
        _this.getMobileFrame().animate({
            opacity: 1
        });
    }

    /*
     * == Animate preview to desktop view ==
     */
    this.animatePreviewToDesktop = function(){
        var $iframeContainer = $modal.find(".iframe-container");

        // Animate mobile frame to opacity 0
        _this.getMobileFrame().animate({
            opacity: 0
        });
        // Animate iframe container, restore width.
        $iframeContainer.animate({
            width: options.defaultWidth,
            top: 0
        },"normal",function(){
            _this.setIframeDimensions();

            // Reset iframe container.
            $iframeContainer
                .scrollTop(0)
                .css("overflow-y", "hidden")
                .height("auto");

            // Reset preview container height
            $modal.find(".preview-container").height("auto");
        });
    }

    this.init();
};
