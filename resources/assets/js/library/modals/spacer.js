/*
 | Configuration Modals: spacer
 | The code below contains order_number default functionality.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.spacer = function( params ){

    var options = $.extend({
        target: null,
        modalSelector: ".modal-mpf-content-data#spacer-config",
        inputSelector: ".spacer-size",
        colorpickerSelector: "select[name=bg-option-selected]",
        moduleData: null
    }, params );

    var $targetModule = null;

    var _this = this;

    if( !options.target || !$(options.target).size ){
        return false;
    }else{
        $targetModule = $(options.target);
    }

    this.init = function(){
        if( options.target ){
            options.moduleData = $targetModule.data("params");
        }

        // Load tags on field.
        if( options.moduleData.data && options.moduleData.data.size ) {
            $( options.modalSelector ).find( options.inputSelector + '[data-value=' + options.moduleData.data.size + ']' ).attr('data-selected', '');

            // Set click on submit button
            $( options.modalSelector ).on("click", options.inputSelector, function(){
                $( options.modalSelector).find(options.inputSelector).removeAttr('data-selected');
                $(this).attr('data-selected', '');
            });

        }

        // Append colors to background selector
        if( options.moduleData.background_colors && options.moduleData.background_colors.list ){
            $.each( options.moduleData.background_colors.list, function( color, value ){
                options.data = {
                    color: color,
                    value: value
                };
                transformers.inlineColorpicker(options);
            });

            // Init Simplecolorpicker
            var selectColor = (options.moduleData.data.background_color)? options.moduleData.data.background_color : options.moduleData.background_colors.default;
            $(options.modalSelector).find( options.colorpickerSelector ).simplecolorpicker();
            $(options.modalSelector).find( options.colorpickerSelector ).simplecolorpicker('selectColor', selectColor);
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

        // Get data from fields
        if( $(options.inputSelector + "[data-selected]").length ){
            options.moduleData.data.size = $(options.inputSelector + "[data-selected]").data("value");
            moduleManager.saveInData( $targetModule, "size", options.moduleData.data.size );
            // Set link in DOM
            $targetModule.find(".custom-spacer").attr("height", options.moduleData.data.size );
        }

        // Get data from fields
        if( $(".simplecolorpicker span[data-selected]").length ){
            options.moduleData.data.background_color = $(".simplecolorpicker span[data-selected]").data("color");
            moduleManager.saveInData( $targetModule, "background_color", options.moduleData.data.background_color );
        }

        // Set data into module.
        $targetModule.find(">td")
            .attr( "bgcolor", options.moduleData.data.background_color )
            .css( "background-color", options.moduleData.data.background_color );

        // Close Popup
        $.magnificPopup.close();
    };

    return this;
};