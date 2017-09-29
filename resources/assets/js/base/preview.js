(function ($) {
    
    // On Ready
    $("iframe").ready(function ($) {

        $('#modal-campaign-preview').css('position','static');
        $('#modal-campaign-preview').css('display','block');
        $('#modal-campaign-preview').removeClass('fade');
        $('.modal-body').css('padding-top','10px');

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
            $this.height($this.contents().height());
        });

    });

    function animatePreviewToDesktop() {
      var $iframeContainer = $("#modal-campaign-preview .preview-container .iframe-container");
      $("#modal-campaign-preview .preview-body").scrollTop(0);
      // Animate desktop frame to opacity 0
      $("#modal-campaign-preview .preview-container .mobile-frame").animate({
        opacity: 0
      }, "normal", function () {
        $iframeContainer
          .scrollTop(0)
          .css("overflow-y", "auto")
          .animate({
            width: $iframeContainer.data("template-width"),
            top: "0"
          }, function () {
            $.when(
              // Animate container to desktop size
              $(".iframe-container > iframe").animate({
                height: $iframeContainer.find('iframe').contents().find('body').find('table').height()
              })
            ).done(function () {
              $iframeContainer.css("height", "auto");
              $iframeContainer.find("iframe").width("100%");
              $iframeContainer.find("iframe .wrapper-table").css('width', '100%');
            });
          });
      });
    }

    function animatePreviewToMobile() {
      var $iframeContainer = $("#modal-campaign-preview .preview-container .iframe-container");
      var displayWidth = $iframeContainer.data("template-mobile-width");
      var $iframe = $("#modal-campaign-preview .preview-container iframe");

      // Animate iframe to mobile size
      $iframeContainer.animate({
        width: displayWidth,
        top: 0
      }, function () {

        $iframe.contents().find('.wrapper-table').css('width', '100%');
        
        $iframe.animate({
          height: $iframe.contents().find("body").height(),
          width: displayWidth,
        }, function () {
          $iframeContainer.css("overflow-y", "auto");
        });

        // Animate mobile frame to opacity 1
        $("#modal-campaign-preview .preview-container .mobile-frame").animate({
          opacity: 1
        });
      });
    }

    $('.btn-copy').click(function(){
      var $modal = $('.public-view-modal');
      var input = $modal.find(".share-preview input")[0]
      input.focus();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("copy");
    });

})(jQuery);
