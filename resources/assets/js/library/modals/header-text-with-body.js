/*
 | Configuration Modals: header_text_with_body
 | The code below contains header_text_with_body default functionality.
 */
var ConfigModals = ConfigModals || {};

ConfigModals.header_text_with_body = function( params ){

    alert('dsad');

    var options = $.extend({
        target: null,
        modalSelector: ".modal-mpf-content-data#header-text-with-body-config",
        colorpickerSelector: "select[name=bg-option-selected]",
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

        // Append colors to background selector
        if( options.moduleData.background_colors && options.moduleData.background_colors.list ){
            $.each( options.moduleData.background_colors.list, function( color, value ){
                $(options.modalSelector).find( options.colorpickerSelector ).append($("<option>").attr('value',value).text(color));
                // Append detail to background select.
                setTimeout(function(){
                    $(options.modalSelector).find('.simplecolorpicker span[title="'+ color +'"]')
                                                .append($('<span>').text(color))
                                                .append($('<span>').text(value)); 
                }, 100);
            });

            // add style to background select.
            $( options.modalSelector ).on("click", "span.color", function(){
                $( options.modalSelector ).find('.simplecolorpicker .color').removeAttr('data-selected');     
                $(this).attr('data-selected','');
                return false;
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
        options.moduleData.data.link0 = $( options.modalSelector ).find("input[name=first-link-url]").val();

        if( $(".simplecolorpicker span[data-selected]").length ){
            options.moduleData.data.background_color = $(".simplecolorpicker span[data-selected]").data("color");
            moduleManager.saveInData( $targetModule, "background_color", options.moduleData.data.background_color );
        }

        if( Application.utils.validate.validateForm( $( options.modalSelector ).find("form")[0] )){
            // Save comments in data-paramas
            moduleManager.saveInData( $targetModule, "link0", options.moduleData.data.link0 );
            // Set link in DOM
            $targetModule.find(".st-link-target:eq(0)").attr( "href", options.moduleData.data.link0 );
            // Set tr background color
            $targetModule.find(">td")
                .attr( "bgcolor", options.moduleData.data.background_color )
                .css( "background-color", options.moduleData.data.background_color );

            // Close Popup
            $.magnificPopup.close();
        }
    };

    return this;
};