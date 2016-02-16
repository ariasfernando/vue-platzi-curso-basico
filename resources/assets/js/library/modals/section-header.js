/*
 | Configuration Modals: body_headline
 | The code below contains headline_text default functionalinty.
 | Required: .
 */

var ConfigModals = ConfigModals || {};

ConfigModals.section_header = function( params ){

	var options = $.extend({
		target: null,
		modalSelector: ".modal-mpf-content-data#section-header-config",
		colorpickerSelector: "select[name=bg-option-selected]",
		moduleData: null
	}, params );

	var $targetModule = null;

	var _this = this;

	if( !options.target || !$(options.target).length ){
		return false;
	}else{
		$targetModule = $(options.target);
	}

	this.init = function(){
		if( options.target ){
			options.moduleData = $targetModule.data("params");
		}

		options.moduleData.data = options.moduleData.data || {};

		if( options.moduleData.background_colors.list ){
            $.each( options.moduleData.background_colors.list, function( color, value ){
                transformers.inlineColorpicker($.extend(options, {data: {color: color, value: value}}));
            });
		}


	 	// Init Simplecolorpicker
		var selectColor = (options.moduleData.data.background_color)? options.moduleData.data.background_color : options.moduleData.background_colors.default;
		$(options.modalSelector).find( options.colorpickerSelector ).simplecolorpicker();
		$(options.modalSelector).find( options.colorpickerSelector ).simplecolorpicker('selectColor', selectColor);

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

		// Get data from fields
		options.moduleData.data.background_color = $(".simplecolorpicker span[data-selected]").data("color");

		// Save data in data-paramas
		moduleManager.saveInData( $targetModule, "background_color", options.moduleData.data.background_color );

		// Set data into module.
		$targetModule.find(">td")
			.attr( "bgcolor", options.moduleData.data.background_color )
			.css( "background-color", options.moduleData.data.background_color );

		$.magnificPopup.close();
	};

	return this;
};