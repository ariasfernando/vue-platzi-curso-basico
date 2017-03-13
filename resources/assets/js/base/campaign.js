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
         * -- Init Auto Save
         */
        initAutoSave();

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

            var previewModal = new campaignPreview({
                campaignId: campaignManager.getCampaignId()
            });
            previewModal.open(emailHtml);
        });

        // -- Display Preview --
        $(".campaign-send-preview").click(function () {
            var previewModal = new campaignPreview({
                campaignId: campaignManager.getCampaignId(),
                preview: false
            });
            previewModal.open();
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
            var emailHtml = campaignManager.getCleanedHtml();
            if (emailHtml) {
                campaignManager.startProcessCampaign();
            }else{
                Application.utils.alert.display("", "This campaign cannot be finished from an empty email.", "warning");
            }
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

        // Campaign finished modal: Redirect to dashboard
        $("#modal-campaign-finished").on('click', '.btn-back-to-dashboard', function () {
            $(window).unbind('beforeunload');
            window.location.href = Application.globals.baseUrl + "/";
        });

    });

    function initAutoSave(){
        if ($(".btn-auto-save").is(":checked")) {
            campaignManager.autoSave('enabled');
        }
        // Auto save control
        $(".btn-auto-save").click(function () {
            if ($(this).is(":checked")) {
                campaignManager.autoSave('enabled');
            } else {
                campaignManager.autoSave('disabled');
            }
        });
    }

})(jQuery);
