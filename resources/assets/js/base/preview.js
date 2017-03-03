(function ($) {
    
    // On Ready
    $("iframe").ready(function ($) {

        $('#modal-campaign-preview').css('position','static');
        $('#modal-campaign-preview').css('display','block');
        $('#modal-campaign-preview').removeClass('fade');
        $('.modal-body').css('padding-top','10px');
        $('.send-preview').hide();
        $('.modal-header').hide();

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

        $('#modal-campaign-preview').find("#email-preview-iframe").load(function () {
            var $this = $(this);
            $this.height($this.contents().find('.email-body').height());
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
                    // Reset preview container height
                    $(".preview-container").height("auto");
                });
        });
    }

    function animatePreviewToMobile() {
        var displayWidth = 320;
        var displayHeight = 525;
        var $iframeContainer = $("#modal-campaign-preview .preview-container .iframe-container");

        // Animate container to mobile height
        $("#modal-campaign-preview .preview-container").animate({
            height: $(".mobile-frame").height()
        });
        // Animate iframe to mobile size
        $iframeContainer.animate({
            width: displayWidth,
            height: displayHeight,
            top: 60
        }, function () {
            var emailHeight = $("#modal-campaign-preview .preview-container iframe").contents().find("body").height();
            var iframeHeight = displayHeight - 1;

            if (emailHeight > iframeHeight) {
                iframeHeight = emailHeight;
            }

            $("#modal-campaign-preview .preview-container iframe").animate({
                height: iframeHeight
            }, function () {
                $iframeContainer.css("overflow-y", "auto");
            });

            // Animate mobile frame to opacity 1
            $("#modal-campaign-preview .preview-container .mobile-frame").animate({
                opacity: 1
            });
        });
    }


})(jQuery);
