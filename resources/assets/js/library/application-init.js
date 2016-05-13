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
		.on("keypress","input.url-format", function(e) {
			if(e.which == 13) {
				var resultUrl = Application.utils.validate.parseUrl( $(this).val() );
				if( resultUrl ){
					$(this).val( resultUrl );
				}
			}
		})
		.on("blur","input.url-format", function(){
			var resultUrl = Application.utils.validate.parseUrl( $(this).val() );
			if( resultUrl ){
				$(this).val( resultUrl );
			}
		})
        .ready(function(){
            $('#top-link-block').removeClass('hidden').affix({
                // how far to scroll down before link "slides" into view
                offset: {top:100}
            });
        });

	// Set Editor Configuration for module-manager & campaign-manager.
	Application.utils.getCanvas = function(){
		return ( $("#emailCanvas > tbody").length )? $("#emailCanvas > tbody") : false;
	};
	Application.utils.getConfigurationForm = function(){
		return ( $("#campaignConfiguration").length )? $("#campaignConfiguration") : false;
	};

	if( Application.onInit ){
		Application.onInit();
	}
};
