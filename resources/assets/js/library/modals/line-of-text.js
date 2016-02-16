/*
 | Configuration Modals: line_of_text
 | The code below contains line_of_text default functionalinty.
 | Note: bootstrap colorpicker plugin is required.
 */

var ConfigModals = ConfigModals || {};

ConfigModals.line_of_text = function( params ){

	var options = $.extend({
		color: null,
		target: null,
		modalSelector: ".modal-mpf-content-data.simple-text-config",
		moduleData: null,
		colorPickerConfig: {},
		stCustomClassSelector: ".st-edit-text",
		elementTargetSelector: "[contenteditable]",
		inputColorPickerSelector: ".stensul-color-picker",
		containerColorPickerSelector: ".section-font-color-picker"
	}, params );

	var $targetModule = null;

	if( !options.target || !$(options.target).length ){
		return false;
	}else{
		$targetModule = $(options.target);
	}

	if( options.target ){
		options.moduleData = $targetModule.data("params");

		if( options.moduleData.plugins && options.moduleData.plugins.colorPicker ){
			options.colorPickerConfig = options.moduleData.plugins.colorPicker;
		}
	}

	var _this = this;

	this.init = function(){
		// Check if is contenteditable or medium editor
		if( $targetModule.find( options.stCustomClassSelector ).length ){
			options.elementTargetSelector = options.stCustomClassSelector;
		}

		// Init color picker
		stensulColorPicker(
			options.colorPickerConfig,
			$( options.modalSelector ).find( options.inputColorPickerSelector ),
			$( options.modalSelector ).find( options.containerColorPickerSelector )
		);

		$( options.modalSelector ).find( options.containerColorPickerSelector ).colorpicker().on('changeColor.colorpicker', function(event){
			options.color = event.color.toHex();
		});

		// On Submit Function
		$( options.modalSelector ).on("click", ".submit-config", function(){
			_this.onSubmit();
			return false;
		});
	};

	this.onSubmit = function(){
		if( !moduleManager ){
			return false;
		}

		// Save color selection in data-paramas
		moduleManager.saveInData( $targetModule, "text-color", options.color );
		// Set color selection text

		if( options.elementTargetSelector == options.stCustomClassSelector){
			$targetModule.find(options.elementTargetSelector + " p").css("color", options.color);
		}else{
			$targetModule.find(options.elementTargetSelector).css("color", options.color);
		}

		// Execute an onBlur to save text.
		$targetModule.find(options.elementTargetSelector).blur();

		// Close Popup
		$.magnificPopup.close();
	};

	return this;
};
