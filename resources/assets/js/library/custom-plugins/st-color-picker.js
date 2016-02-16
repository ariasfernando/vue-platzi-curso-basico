var stensulColorPicker = function( options, inputColorPicker, containerColorPicker ){
	this.defaultConfig = {
		format: 'hex',
		color: '',
		container: containerColorPicker,
		component:'.input-group-addon',
		input: inputColorPicker,
		inline: false,
		align: 'right',
		customClass: 'colorpicker-background-image'
	};

	this.options = $.extend( this.defaultConfig, options );

	var _this = this;

	return containerColorPicker.colorpicker({
		format: inputColorPicker.attr('data-color-format') || _this.options.format,
		color: inputColorPicker.attr('data-color') || _this.options.color,
		component: inputColorPicker.attr('data-component') || _this.options.component,
		inline: inputColorPicker.attr('data-inline') || _this.options.inline,
		align: inputColorPicker.attr('data-align') || _this.options.align,
		customClass: inputColorPicker.attr('data-customClass') || _this.options.customClass
	});
}