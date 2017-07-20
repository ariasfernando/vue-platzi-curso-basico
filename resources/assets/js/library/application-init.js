var Application = Application || {};
var ModuleActions = ModuleActions || {};

Application.init = function(){
    // -- AJAX Setup --
    $.ajaxSetup({
        headers: {
            'X-CSRF-token': Application.globals.csrfToken
        }
    });

    /*
     * This functions fix the modal-open class in body
     */
    $('.modal')
        .on('hidden.bs.modal', function () {
            if( $("body").hasClass("modal-open") && !$('.modal:visible').length ){
                $("body").removeClass("modal-open");
            }else{
                if( !$("body").hasClass("modal-open") && $('.modal:visible').length ){
                    $("body").addClass("modal-open");
                }
            }
        })
        .on('shown.bs.modal', function () {
            if( !$("body").hasClass("modal-open") ){
                $("body").addClass("modal-open");
            }
        });

    //
    $(document)
        .on('dragover drop', '#emailCanvas [contenteditable]:not(.mce-content-body)', function (e) {
                e.preventDefault();
                return false;
         })
        .on('dragover drop', '.modal-mpf-content-data [contenteditable]:not(.mce-content-body)', function (e) {
                e.preventDefault();
                return false;
         })
        .on("keypress","input.url-format", function(e) {
            if(e.which == 13) {
                var resultUrl = Application.utils.validate.parseUrl( $(this).val() );
                if( resultUrl ){
                    $(this).val( resultUrl );
                }
            }
        })
        .on("keypress", "#campaignConfiguration [name!=tag_entry]", function(e) {
            if(e.which == 13) {
                e.preventDefault();
                return false;
            }
        })
        .on("blur","input.url-format", function(){
            var $urlInput = $(this);
            var resultUrl = Application.utils.validate.parseUrl( $urlInput.val() );
            if( resultUrl ){
                $urlInput.val( resultUrl );
            }

            var validationResult = Application.utils.validate.validateField( $urlInput[0] );

            // If the validation isn't successful, add an error class in the input and append a label with the message after the field.
            if( validationResult.success ){
                var validUrlFormat = Application.utils.validate.validateUrlField( $urlInput );
                if ( validUrlFormat.success == false ) {
                    Application.utils.validate.setError($urlInput, Application.utils.validate.messages.url);
                }
            }
        })
        .ready(function(){
            $('#top-link-block').removeClass('hidden').affix({
                // how far to scroll down before link "slides" into view
                offset: {top:100}
            });

            /*
             * == Init tags entry ==
             */
            if( typeof campaignManager == "object" ){
                campaignManager.initTagEntry();
            }
        })
        .on("click",".section-canvas-email .save-as-template",function(event){
            // -- Save Campaign as template
            var button = this;
            $(button).addClass("ajax-loader-small").attr("disabled", "disabled");

            var confirmModal = new Application.utils.confirm({
                message: "Remember that if you save this campaign as template, you won't be able to publish it, you will only be able to edit and clone it.",
                onSubmit: function(){
                    campaignManager.saveAsTemplate(
                        function(){
                            if( $('.save-as-draft:visible').length ){
                                var titleColumnClass = ($('#section-canvas-title-col').attr("class").match(/(^|\s)col-lg-\S+/g) || []).join(' ').trim();
                                var titleColumns = parseInt(titleColumnClass.replace("col-lg-",""));
                                // Update col classes
                                $('#section-canvas-buttons-col')
                                    .removeClass("col-lg-7")
                                    .addClass("col-lg-5");
                                $('#section-canvas-title-col')
                                    .removeClass(titleColumnClass)
                                    .addClass("col-lg-" + String(titleColumns+2));
                                // Hide buttons
                                $('.save-as-draft').hide();
                                $('.campaign-continue').hide();
                                $('#locking').remove();
                            }
                            // Remove spinner.
                            $(button).removeClass("ajax-loader-small").removeAttr("disabled");
                        },
                        function(){
                            $(button).removeClass("ajax-loader-small").removeAttr("disabled");
                        }
                    );
                },
                onCancel: function(){
                    $(button).removeClass("ajax-loader-small").removeAttr("disabled");
                },
                onClose: function(){
                    $(button).removeClass("ajax-loader-small").removeAttr("disabled");
                }
            });

            confirmModal.display();
        })
        .on('click', '.configuration-mod .lock-campaign-btn', function(event) {
            var button = this;
            $(button).addClass('ajax-loader-small').attr('disabled', 'disabled');
            campaignManager.forceLock(function() {
                $(button).removeClass('ajax-loader-small')
                    .addClass('hidden')
                    .removeAttr('disabled');
                $('.unlock-campaign-btn').removeAttr('disabled')
                    .removeClass('hidden');
                $('.save-as-draft').addClass('hidden');
                $('.save-as-template').addClass('hidden');
                $('.campaign-continue').addClass('hidden');
                $('.campaign-preview').addClass('hidden');
                campaignManager.autoSave('disabled');
                $('.auto-save').addClass('hidden');
                $('#locking label span').text('Unlock');
            },
            function() {
                $(button).removeClass('ajax-loader-small').removeAttr('disabled');
            });
            return false;
        })
        .on('click', '.configuration-mod .unlock-campaign-btn', function(event){
            var button = this;
            $(button).addClass('ajax-loader-small').attr('disabled', 'disabled');
            campaignManager.unlockForced(function() {
                $(button).removeClass('ajax-loader-small')
                    .addClass('hidden')
                    .removeAttr('disabled');
                $('.lock-campaign-btn').removeAttr('disabled')
                    .removeClass('hidden');
                $('.save-as-draft').removeClass('hidden');
                $('.save-as-template').removeClass('hidden');
                $('.campaign-continue').removeClass('hidden');
                $('.campaign-preview').removeClass('hidden');
                $('.auto-save').removeClass('hidden');
                if ($('.btn-auto-save').is(':checked')) {
                    campaignManager.autoSave('enabled');
                }
                $('#locking label span').text('Lock');
            },
            function(event) {
                $(button).removeClass('ajax-loader-small');
            });
            return false;
        });

    // Set Editor Configuration for module-manager & campaign-manager.
    Application.utils.getCanvas = function(){
        return ( $("#emailCanvas > tbody").length )? $("#emailCanvas > tbody") : false;
    };
    Application.utils.getFullCanvas = function(){
        return ( $("#emailCanvas").length )? $("#emailCanvas") : false;
    };
    Application.utils.getConfigurationForm = function(){
        return ( $("#campaignConfiguration").length )? $("#campaignConfiguration") : false;
    };

    // Init Api
    Application.api();
    if( Application.onInit ){
        Application.onInit();
    }
};
