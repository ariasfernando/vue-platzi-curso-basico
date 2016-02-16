/*
 | Configuration Modals: image_plus_text
 | The code below contains image_plus_text default functionalinty.
 */

function image_plus_text_configuration( params ){

    var options = $.extend({
        target: null,
        modalSelector: ".modal-mpf-content-data#image-plus-text-config",
        moduleData: null
    }, params );

    var $targetModule = null;

    if( !options.target || !$(options.target).length ){
        return false;
    }else{
        $targetModule = $(options.target);
    }

    var _this = this;

    this.init = function(){
        if( options.target ){
            options.moduleData = $targetModule.data("params");
        }

        // Load comments on field.
        if( options.moduleData.data.link0 ){
            $( options.modalSelector ).find("input[name=first-link-url]").val( options.moduleData.data.link0 );
        }

        // Set click on submit button
        $( options.modalSelector ).on("click", ".submit-config", function(){
            _this.onSubmit();
            return false;
        });
    };

    this.onSubmit = function(){
        if( !moduleManager ){
            return false;
        }

        // Set field value in options
        options.moduleData.data = options.moduleData.data || {};
        options.moduleData.data.link0 = $( options.modalSelector ).find("input[name=first-link-url]").val();

        if( Application.utils.validate.validateForm( $( options.modalSelector ).find("form")[0] )){
            // Save comments in data-paramas
            moduleManager.saveInData( $targetModule, "link0", options.moduleData.data.link0 );
            // Set link in DOM
            $targetModule.find(".st-link-target:eq(0)").attr( "href", options.moduleData.data.link0 );

            // Close Popup
            $.magnificPopup.close();
        }
    };

    return this;
};

var ConfigModals = ConfigModals || {};
ConfigModals.image_plus_text = function( params ){
    return image_plus_text_configuration(params);
};
ConfigModals.image_plus_text_flipped = function( params ){
    return image_plus_text_configuration(params);
};