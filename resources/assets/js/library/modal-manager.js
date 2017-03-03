function modalManager( params ){

    this.modalParams = $.extend({
        name: params.view,
        library_name: Application.globals.library_name,
        element_focus: (params.element_focus)? params.element_focus : '.modal-mpf-content-data'
    }, params);

    this.errorMessages = {
        missingView: "An error occurred while trying to open the configuration modal, missing view param.",
        missingParam: "An error occurred while trying to init the configuration modal, missing params."
    }

    this.modalTarget = null;

    // Open
    this.open = function (callbacks) {
        if (!this.modalParams.view) {
            Application.utils.alert.display("Warning:", this.errorMessages.missingView , "warning");
            return false;
        }

        var _this = this;

        var ajaxCallbacks = $.extend({
            ajaxContentAdded: function () {
                if ( _this.modalParams.config_modal_key && ConfigModals && ConfigModals[ _this.modalParams.config_modal_key ]) {
                    // Get config from modals.php
                    var modalConfig = _this.modalParams;
                    modalConfig.target = _this.modalTarget;
                    modalConfig.modalContent = this.content;
                    // Init configuration modal scripts
                    var configurationModalObj = ConfigModals[ _this.modalParams.config_modal_key ](modalConfig);
                    configurationModalObj.init();
                } else {
                    Application.utils.alert.display("Warning:", this.errorMessages.missingParam, "warning");
                    return false;
                }
            }
        }, callbacks);

        // Open Magnifig Popup
        $.magnificPopup.open({
            type: 'ajax',
            focus: _this.modalParams.element_focus,
            closeOnBgClick: false,
            items: {
                src: Application.globals.baseUrl + "/template/modal"
            },
            ajax: {
                settings: {
                    type: "POST",
                    cache: true,
                    dataType: "html",
                    data: _this.modalParams
                }
            },
            callbacks: ajaxCallbacks
        });
    };

    this.getModalContent = function(){
        var magnificPopup = $.magnificPopup.instance;
        return magnificPopup.content;
    };

    // Close
    this.close = function(){
        this.modalTarget = null;
        $.magnificPopup.close();
    };
};
