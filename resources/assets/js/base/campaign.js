(function ($) {

    /*
     | Init application globals and utils
     */
    if (Application && Application.init) {
        Application.init();
    }

    // Allow exit by adding a class 'allow-exit' to a link.
    $(document).on('click', '.allow-exit', function () {
        $(window).unbind('beforeunload');
        document.location.href = $(this).attr('href');
        return false;
    });

    // Prevent exit.
    $(window).bind('beforeunload', function () {
        return "If you leave this page, you will lose any unsaved changes.";
    });

    /*
     * Init spinner
     */
    var spinner = new Application.utils.spinner();

    // On Ready
    $(document).ready(function ($) {
        /*
         *	-- module manager config  --
         *	Set image editor configs.
         */
        moduleManager.modalConfig = Application.globals.modalsConfig;

        /*
         *	-- Init module Manager --
         *	Set events [ tooltip, move, edit, remove ]
         *	Init modules plugins.
         */
        moduleManager.init();

        /*
         * -- Init Menu --
         */
        campaignMenu();

        /*
         * -- Init campaign lock ping --
         */
        campaignManager.initLockPing();

        /*
         * -- Show warning if already finished campaign
         */
        campaignManager.confirmFinishedCampaignEdition();

        $(".switch-input").change(function (e) {

            var selected = $('.switch-input:checked').val();

            // Trigger global event
            $(document).trigger('switchBuildingMode', selected);

            var width = ( selected == 'desktop' ) ? Application.globals.emailWidth : Application.globals.emailMobileWidth;
            $('.email-canvas').css({width: width + "px"});

            // TODO: Can you enlighten me?
            Application.utils.changeBuildingMode(selected);
        });

        // -- Display Preview --
        $(".campaign-preview").click(function () {
            // Get Email Html
            var emailHtml = campaignManager.getCleanedHtml();
            if (!emailHtml) {
                Application.utils.alert.display("", "A preview cannot be generated from an empty email.", "warning");
                return false;
            }

            // Get modal and email layout
            var $previewModal = $("#modal-campaign-preview");
            var $emailLayout = $previewModal.find("iframe").contents().find("table.email-container");

            // Build Modal
            $emailLayout.empty().append(emailHtml);
            $previewModal.find("iframe").ready(function () {
                $previewModal.find("iframe").height(Application.utils.getCanvas().height());
                $previewModal.find("iframe").data("height", Application.utils.getCanvas().height());
            });

            // Show Peview modal
            $previewModal.modal();

            var mode = $('.switch-input:checked').val();
            $(".btn-" + mode).trigger('click');
        });

        // -- Save Campaign as draft
        $(".save-as-draft").click(function () {
            var button = this;
            $(button).addClass("ajax-loader-small").attr("disabled", "disabled");

            var saveCampaign = campaignManager.save();

            if (!saveCampaign) {
                $(button).removeClass("ajax-loader-small").removeAttr("disabled");
                return false;
            }

            saveCampaign.done(function () {
                Application.utils.alert.display("", "This email was saved successfully.", "success");
            });

            saveCampaign.fail(function () {
                Application.utils.alert.display("Error:", "An error occurred while trying to save, please try again later.", "danger");
            });

            saveCampaign.always(function () {
                $(button).removeClass("ajax-loader-small").removeAttr("disabled");
            });

            return false;
        });

        // -- Start Process campaign
        $(".campaign-continue").click(function () {
            campaignManager.startProcessCampaign();
            return false;
        });

        // Campaign precessed modal events: Click Btn HTML
        $("#modal-campaign-processed").on("click", ".btn-html", function () {
            $("#modal-campaign-processed textarea").text(campaignManager.htmlCode);
        });
        // Campaign precessed modal events: Click Btn Plaintext
        $("#modal-campaign-processed").on("click", ".btn-plain-text", function () {
            $("#modal-campaign-processed textarea").text(campaignManager.plainText);
        });

        // Campaign precessed modal: Redirect to dashboard on close.
        $("#modal-campaign-processed").on('hidden.bs.modal', function () {
            $(window).unbind('beforeunload');
            window.location.href = Application.globals.baseUrl + "/";
        });

        // Preview Modal Events: Desktop Btn Click
        $("#modal-campaign-preview").on('click', '.btn-desktop', function () {
            if ($(this).parent().hasClass("active")) {
                return false;
            }
            // Animate preview to desktop size
            animatePreviewToDesktop();
        });
        // Preview Modal Events: Mobile Btn Click
        $("#modal-campaign-preview").on('click', '.btn-mobile', function () {
            if ($(this).parent().hasClass("active")) {
                return false;
            }
            // Animate preview to mobile size
            animatePreviewToMobile();
        });

        // Preview Modal Events: Mobile Btn Click
        $("#modal-campaign-preview").on('click', '.btn-send', function () {
            var _this = this;
            var $sendPreviewForm = $("#send-preview-form");
            var errorAlert = '<div class="alert alert-danger" role="alert" style="display:none;">An error occurred while trying to send the email, please try again later.</div>';

            $(_this)
                .parent()
                .removeClass("success")
                .removeClass("spinner");

            if ($(".btn-send").find(".status-icon").length) {
                $(".btn-send").find(".status-icon").remove();
            }

            // Validate Emails form
            if (Application.utils.validate.validateForm($sendPreviewForm[0])) {
                $(_this).addClass("ajax-loader-small").attr("disabled", "disabled");
                $(_this).parent().removeClass("success").addClass("spinner");
                // At first we must save the campaign.
                var saveCampaign = campaignManager.save({saveHtml: true, validateForms: false});

                // Hide modal if validation is invalid
                if (!saveCampaign) {
                    $("#modal-campaign-preview").modal("hide");
                    return false;
                }

                // On Save Success
                saveCampaign.done(function (campaignId) {
                    // Add loader into button
                    // Remove status icon if are someone there
                    $(_this).prev("i.status-icon").remove();
                    // Remove alerts before send
                    $("#modal-campaign-preview .send-preview .alert").slideUp("fast", function () {
                        $(this).remove();
                    });

                    // remove error
                    $(_this).parent().find("[name=send-preview-to]").removeClass("error");
                    $(_this).parent().find("label.error").remove();

                    // Send Preview Email
                    campaignManager.sendPreviewEmail(
                        // Email
                        $sendPreviewForm.find("input[name=send-preview-to]").val(),
                        // Success
                        function (response) {
                            if (response.processed) {
                                // Display success icon.
                                $(_this).append('<i class="glyphicon glyphicon-ok status-icon"></i>');
                                $(_this).parent().removeClass("spinner").addClass("success");
                                $(_this).find('.status-icon').animate({
                                    opacity: 1
                                });
                            } else {
                                $(_this)
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
                            $("#modal-campaign-preview .send-preview")
                                .prepend(errorAlert)
                                .find(".alert").slideDown();
                        },
                        // Always
                        function () {
                            // Remove loader.
                            $(_this).removeClass("ajax-loader-small").removeAttr("disabled", "disabled");
                        }
                    );
                });

                // On Save Fail
                saveCampaign.fail(function () {
                    $("#modal-campaign-preview .send-preview")
                        .prepend(errorAlert)
                        .find(".alert").slideDown();
                });

            }
            return false;
        });
        // Preview Modal Events: On close
        $("#modal-campaign-preview").on('hidden.bs.modal', function () {
            $("#modal-campaign-preview .btn-send i").remove();
            $("#modal-campaign-preview .btn-send")
                .removeClass("ajax-loader-small")
                .removeAttr("disabled");
            $("#modal-campaign-preview .btn-send").parent().removeClass("spinner success");
        });
        // Preview Modal Events: Before show
        $("#modal-campaign-preview").on('show.bs.modal', function () {
            // Remove preview height if is set.
            $(this).find(".preview-container").removeAttr("style");
        });
        // Preview Modal Events: Before show
        $("#modal-campaign-preview").on('show.bs.modal', function () {
            // Remove preview height if is set.
            $(this).find("iframe").contents().find("a").click(function () {
                return false;
            });
        });

        // Campaign finished modal: Redirect to dashboard
        $("#modal-campaign-finished").on('click', '.btn-back-to-dashboard', function () {
            $(window).unbind('beforeunload');
            window.location.href = Application.globals.baseUrl + "/";
        });
    });

    function animatePreviewToDesktop() {
        var $iframeContainer = $("#modal-campaign-preview .preview-container .iframe-container");

        // Animate mobile frame to opacity 0
        $("#modal-campaign-preview .preview-container .mobile-frame").animate({
            opacity: 0
        }, "normal", function () {
            $iframeContainer
                .scrollTop(0)
                .css("overflow-y", "hidden")
                .animate({
                    width: $iframeContainer.data("template-width"),
                    top: "0"
                }, function () {
                    $.when(
                        // Animate container to desktop size
                        $(".iframe-container, .preview-container, .iframe-container > iframe").animate({
                            height: $iframeContainer.find('iframe').contents().find('.email-body').height()
                        })
                    ).done(function () {
                            $iframeContainer
                                .css("height", "auto");
                            $iframeContainer.find("iframe").width("100%");
                        });
                });
        });
    }

    function animatePreviewToMobile() {
        var displayWidth = 320;
        var displayHeight = 605;
        var $iframeContainer = $("#modal-campaign-preview .preview-container .iframe-container");

        // Animate container to mobile height
        $("#modal-campaign-preview .preview-container").animate({
            height: "855px"
        });
        // Animate iframe to mobile size
        $iframeContainer.animate({
            width: displayWidth,
            height: displayHeight,
            top: "139px"
        }, function () {
            var emailHeight = $("#modal-campaign-preview .preview-container iframe").contents().find("body").height();
            var iframeHeight = displayHeight - 1;

            if (emailHeight > iframeHeight) {
                iframeHeight = emailHeight;
            }

            $("#modal-campaign-preview .preview-container iframe").animate({
                height: iframeHeight
            }, function () {
                // If the height of the email is greater than the frame height add scrollbars.
                if (iframeHeight > displayHeight) {
                    $iframeContainer.animate({
                        width: displayWidth + 17
                    }, function () {
                        $iframeContainer.css("overflow-y", "auto");
                    });
                } else {
                    $iframeContainer.css("overflow-y", "hidden");
                }
            });

            // Animate mobile frame to opacity 1
            $("#modal-campaign-preview .preview-container .mobile-frame").animate({
                opacity: 1
            });
        });
    }

})(jQuery);