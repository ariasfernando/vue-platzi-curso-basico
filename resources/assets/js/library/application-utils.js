var Application = Application || {};

Application.utils = {
	/*
	 * 	Alerts
	 */
	alert: {
		// Use it to set timeout function and close alerts after x seconds.
		timeOut: null,
		errorBox: Application.globals.errorPlaceholder,
		/*
		 *	Display alerts
		 *	Type: info(default), success, waring, danger
		 */
		display: function( title, message, type ){
			if( !title && !message )
				return false

			if( Application.utils.alert.timeOut != null )
				clearTimeout( Application.utils.alert.timeOut );

			var $errorBox = $( this.errorBox );

			if( $errorBox.length ){

				if( type==null || !$.inArray( type, ["info","success","warning","danger"]) ){
					type = "info";
				}

				// If it's visible hide it and show it again.
				if( $errorBox.is(":visible") ){
					$errorBox.slideUp("fast",function(){
						Application.utils.alert.display( title, message, type );
					});
					return false;
				}

				// Build text message
				var text = "";
				if( title != "" ){
					text += "<strong>"+title+"</strong> ";
				}
				if( message != "" ){
					text += message;
				}

				// Change Text
				$errorBox.find(".alert").empty().append( text );
				// Set alert class
				$errorBox
					// Remove current type class
					.find(".alert").removeClass(function (index, css) {
						return (css.match (/(^|\s)alert-\S+/g) || []).join(' ');
					})
					// Add new alert type class
					.addClass("alert-" + type);

				// Show alert
				$errorBox.slideDown(function(){
					Application.utils.alert.scrollToMe();
					// Hide Alert after 5 seconds
					Application.utils.alert.timeOut = setTimeout(function(){
						if( $errorBox.is(":visible") ){
							$errorBox.slideUp("slow");
						}
					}, 8000);
				});
			}
		},
		scrollToMe: function(){
			var $errorBox = $( this.errorBox );

			if( $errorBox.find(".alert:visible").length ){
				$('html, body').animate({
					scrollTop: $errorBox.offset().top - 15
				}, 800);
			}

		}
	},
	// Display a confirm alert
	confirm: function( options ){
		this.defaultConfig = {
			confirmModalId: "modal-confirm",
			message: "",
			noCancel: false,
			labels: {
				submitBtn: "Accept",
				cancelBtn: "Cancel"
			},
			onSubmit: function(){},
			onCancel: function(){},
			onClose: function(){}
		};

		this.confirmOptions = $.extend( this.defaultConfig, options );

		this.display = function(){
			var confirm = this;
			var $confirmModal = $("#"+confirm.confirmOptions.confirmModalId);

			// Remove all attached events from submit button.
			$confirmModal.find(".btn-submit").unbind();

			// Set text
			$confirmModal.find(".modal-body").text( confirm.confirmOptions.message );
			$confirmModal.find(".btn-submit").text( confirm.confirmOptions.labels.submit );
			$confirmModal.find(".btn-cancel").text( confirm.confirmOptions.labels.cancelBtn );

			// Set onSubmit event
			$confirmModal.find(".btn-submit").one( "click", function(){
				confirm.confirmOptions.onSubmit();
				$confirmModal.modal("hide");
			});

			// Set onClose event
			$confirmModal.find(".close").one( "click", function(){
				confirm.confirmOptions.onClose();
				$confirmModal.modal("hide");
			});
			
			if(!confirm.confirmOptions.noCancel){
			// Set onCancel event
				$confirmModal.find(".btn-cancel").one( "click", function(){
					confirm.confirmOptions.onCancel();
					$confirmModal.modal("hide");
				});
			}
			else {
				$confirmModal.find(".btn-cancel").hide();				
			}

			// Show modal.
			$confirmModal.modal({
				backdrop: "static"
			});
		};
	},

	/*
	 *	-- Modal Spinner --
	 */
	spinner: function() {
		var $modalSpinner = $("#modal-spinner");

		// On hidden: Remove style attribute to remove all boostrap modal style.
		$modalSpinner.on('hidden.bs.modal', function(){
			$("body").removeAttr("style");
			// Remove <p> if exist into modal body.
			if( $modalSpinner.find(".modal-body p").length ){
				$modalSpinner.find(".modal-body p").remove();
			}
		});

		this.hide = function(){
			$modalSpinner.modal("hide");
		};

		this.show = function( optionalText ){

			if( optionalText ){
				$modalSpinner.find(".modal-body").append("<p>"+optionalText+"</p>");
			}

			$modalSpinner.modal({
				backdrop: "static",
				keyboard: false
			});
		};

		this.text = function( text ){
			// If <p> exist into spinner modal, animate and change text.
			if( $modalSpinner.find(".modal-body p").length ){
				$modalSpinner.find(".modal-body p").animate({
					opacity: 0
				},function(){
					$(this).text( text ).animate({
						opacity: 1
					});
				});

			// If not exist, append element with text.
			}else{
				$modalSpinner.find(".modal-body").append('<p style="opacity:0;">'+text+'</p>');
				$modalSpinner.find(".modal-body p").animate({
					opacity: 1
				});
			}

		};
	},

	/*
	 * 	-- Form Validations --
	 */
	validate: {
		// Default Messages.
		messages: {
			required: {
				default: "Please, complete this field.",
				file: "Please, select a file."
			},
			email: "Please, enter a valid email address.",
			compareTo: "The field not match.",
			minLength: "The field minimum size is [min].",
			url: "Please, enter a valid url.",
			invalidFileType: "Please, upload a valid file.",
			invalidFileSize: "The file exceeds the size limit."
		},
		// Validate if a field is filled.
		validateRequiredField: function( field ){
			var result = false;
			var $field = $(field);

			switch( $field.attr("type") ){
				case "checkbox":
					break;
				case "radio":
					break;
				default:
					result = ( $field.val() != "");
			}

			return result;
		},
		validateEmailFormat: function( field ){
			var emails = field.value.split(";").filter(Boolean)
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

			for( var i=0; i<emails.length; i++ ){
				if( !re.test(emails[i].trim()) ){
					return false;
				}
			}

			return true;
		},
		parseUrl: function( url ){
			if( url == "" || Application.utils.isAmpScript(url) ){
				return false;
			}
			var result = url.search(new RegExp(/^http/i));
			if( result ) {
				return "http://"+url;
			}
		},
		validateUrlField: function( field ){
			if( !field.value ){
				return true;
			}

			return this.validateUrlFormat( field.value );
		},
		validateCompareField: function( field, comparedField ){

			if( field.value == comparedField.val() ){
				return true;
			}

			return false;
		},
		validateUrlFormat: function( value ){
			if( !value ){
				return true;
			}

			var re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[^\s]*)?$/i;
			if( !re.test( value ) && !Application.utils.isAmpScript(value) ){
				return false;
			}

			return true;

		},
		validateFileType: function( field ){
			this.initField( field );
			var imgAllowedExtension = Application.globals.imageAllowedExtensions;

			if( field.value != '' ){
				if( jQuery.inArray( field.files[0].type, imgAllowedExtension) == -1){
					this.setError( field, this.messages.invalidFileType );
					return false;
				}
			}
			return true;
		},
		validateFileSize: function( field ){
			this.initField( field );
			var imageSizeLimit = Application.globals.imageUploadSizeLimit;

			if( field.value != '' ){
				// Check image size
				if( field.files[0].size > imageSizeLimit ){
					this.setError( field, this.messages.invalidFileSize);
					return false;
				}
			}

			return true;
		},
		initField: function( field ){
			if( $(field).hasClass("error") ){
				$(field).removeClass("error");
				$(field).next("label.error").remove();
			}
		},
		setError: function( field, message ){
			$(field).addClass("error").after('<label class="error">'+message+'</label>');
		},
		validateField: function( field ){
			var errors = false;
			var validate = this;

			// We use this variable to set the error message and add the error class.
			var validationResult = {
				success: null,
				message: ""
			};

			validate.initField( field );

			var $field = $(field);
			// Get validation params.
			var validationParams = $field.data("validation");
			// REQUIRED FIELD: If is a required field
			if( validationParams.required && validationParams.required === true || validationParams.required === "true"){
				// Set the result of the validation
				validationResult.success = validate.validateRequiredField( field );

				// If isn't successful, set the error messages.
				if( !validationResult.success ){
					switch( field.type ){
						case "file":
							validationResult.message = validate.messages.required.file;
							break;
						default:
							validationResult.message = validate.messages.required.default;
					}
					errors = true;
				}
			}

			// EMAIL FORMAT: check valid email.
			if( validationParams.email && validationResult.success != false ){
				// Set the result of the validation
				validationResult.success = validate.validateEmailFormat( field );

				// If isn't successful, set the error messages.
				if( !validationResult.success ){
					validationResult.message = validate.messages.email;
					errors = true;
				}
			}

			// COMPARE FIELDS: check if have the same value.
			if( validationParams.compareTo && validationResult.success != false ){
				// Set the result of the validation
				validationResult.success = validate.validateCompareField( field, $(form).find('input[name="'+validationParams.compareTo+'"]')  );

				// If isn't successful, set the error messages.
				if( !validationResult.success ){
					validationResult.message = validate.messages.compareTo;
					errors = true;
				}
			}

			// MIN LENGTH: check the filed min length.
			if( validationParams.minLength && validationResult.success != false ){
				// Set the result of the validation
				validationResult.success = (field.value.length >= validationParams.minLength );

				// If isn't successful, set the error messages.
				if( !validationResult.success ){
					validationResult.message = validate.messages.minLength.replace("[min]", validationParams.minLength);
					errors = true;
				}
			}

			// URL FORMAT: check valid url.
			if( validationParams.url && validationResult.success != false ){
				// Set the result of the validation
				validationResult.success = validate.validateUrlField( field );

				// If isn't successful, set the error messages.
				if( !validationResult.success ){
					validationResult.message = validate.messages.url;
					errors = true;
				}
			}

			if( errors ){
				validationParams.success = false;
				validate.setError( field, validationResult.message);
			}

			return validationResult;
		},
		// Generic form validation.
		validateForm: function( form ){
			if( !form )
				return false;

			var validate = this;

			// Get all inputs of the form.
			var inputs = $(form).find("*[data-validation]");
			var errors = false;

			// Check each input.
			$.each( inputs, function( key, field ){
				var validationResult = validate.validateField( field );
				// If the validation isn't successful, add an error class in the input and append a label with the message after the field.

				if( validationResult.success == false ){
					errors = true;
				}

			});

			return !errors;
		}
	},
	/*
	 * Ajax call
	 */
	doAjax: function( url, ajaxOptions ){
		if( !url )
			return false;

		var options = $.extend( {
			type: "POST",
			async: true,
			url: Application.globals.baseUrl + url,
		}, ajaxOptions );

		return $.ajax( options );
	},

	processQueue: {
		getJobStatus: function( jobId, callback, failCallback ){
			if( !jobId ) {
				return false;
			}

			// Do ajax to get process status.
			var ajaxRequest = Application.utils.doAjax("/queue/status/process/" + jobId, { type: "GET" });

			// On ajax Done
			ajaxRequest.done(function( response ){
				// If status isn't finished
				if ( response.status == "started" || response.status == "queued" ){
					// Check again in 1 second.
					setTimeout(function(){
						Application.utils.processQueue.getJobStatus(jobId, callback, failCallback);
					}, 1000);

				} else if (response.status == "finished") {
					callback();
				} else {
					failCallback();
				}
			});

			ajaxRequest.fail(function(){

				if (failCallback) {
					failCallback();
				}
			});
		}
	},

	/*
	 * Return navigator name and version
	 */
	getNavigator: function(){
		var ua= navigator.userAgent, tem,
		M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		}
		if(M[1]=== 'Chrome'){
			tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
			if(tem!= null){
				return tem.slice(1).join(' ').replace('OPR', 'Opera');
			}
		}
		M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem= ua.match(/version\/(\d+)/i))!= null){
			M.splice(1, 1, tem[1]);
		}
		return M;
	},

	/*
	 * Convert especial characters
	 */
	charConvert: function(str, inverse) {

		var chars = ["©","Û","®","ž","Ü","Ÿ","Ý","$","Þ","%","¡","ß","¢","à","£","á","À","¤","â","Á","¥","ã","Â","¦","ä","Ã","§","å","Ä","¨","æ","Å","©","ç","Æ","ª","è","Ç","«","é","È","¬","ê","É","­","ë","Ê","®","ì","Ë","¯","í","Ì","°","î","Í","±","ï","Î","²","ð","Ï","³","ñ","Ð","´","ò","Ñ","µ","ó","Õ","¶","ô","Ö","·","õ","Ø","¸","ö","Ù","¹","÷","Ú","º","ø","Û","»","ù","Ü","@","¼","ú","Ý","½","û","Þ","€","¾","ü","ß","¿","ý","à","‚","À","þ","á","ƒ","Á","ÿ","å","„","Â","æ","…","Ã","ç","†","Ä","è","‡","Å","é","ˆ","Æ","ê","‰","Ç","ë","Š","È","ì","‹","É","í","Œ","Ê","î","Ë","ï","Ž","Ì","ð","Í","ñ","Î","ò","‘","Ï","ó","’","Ð","ô","“","Ñ","õ","”","Ò","ö","•","Ó","ø","–","Ô","ù","—","Õ","ú","˜","Ö","û","™","×","ý","š","Ø","þ","›","Ù","ÿ","œ","Ú","&","<",">"];
		var codes = ["&copy;","&#219;","&reg;","&#158;","&#220;","&#159;","&#221;","&#36;","&#222;","&#37;","&#161;","&#223;","&#162;","&#224;","&#163;","&#225;","&Agrave;","&#164;","&#226;","&Aacute;","&#165;","&#227;","&Acirc;","&#166;","&#228;","&Atilde;","&#167;","&#229;","&Auml;","&#168;","&#230;","&Aring;","&#169;","&#231;","&AElig;","&#170;","&#232;","&Ccedil;","&#171;","&#233;","&Egrave;","&#172;","&#234;","&Eacute;","&#173;","&#235;","&Ecirc;","&#174;","&#236;","&Euml;","&#175;","&#237;","&Igrave;","&#176;","&#238;","&Iacute;","&#177;","&#239;","&Icirc;","&#178;","&#240;","&Iuml;","&#179;","&#241;","&ETH;","&#180;","&#242;","&Ntilde;","&#181;","&#243;","&Otilde;","&#182;","&#244;","&Ouml;","&#183;","&#245;","&Oslash;","&#184;","&#246;","&Ugrave;","&#185;","&#247;","&Uacute;","&#186;","&#248;","&Ucirc;","&#187;","&#249;","&Uuml;","&#64;","&#188;","&#250;","&Yacute;","&#189;","&#251;","&THORN;","&#128;","&#190;","&#252","&szlig;","&#191;","&#253;","&agrave;","&#130;","&#192;","&#254;","&aacute;","&#131;","&#193;","&#255;","&aring;","&#132;","&#194;","&aelig;","&#133;","&#195;","&ccedil;","&#134;","&#196;","&egrave;","&#135;","&#197;","&eacute;","&#136;","&#198;","&ecirc;","&#137;","&#199;","&euml;","&#138;","&#200;","&igrave;","&#139;","&#201;","&iacute;","&#140;","&#202;","&icirc;","&#203;","&iuml;","&#142;","&#204;","&eth;","&#205;","&ntilde;","&#206;","&ograve;","&#145;","&#207;","&oacute;","&#146;","&#208;","&ocirc;","&#147;","&#209;","&otilde;","&#148;","&#210;","&ouml;","&#149;","&#211;","&oslash;","&#150;","&#212;","&ugrave;","&#151;","&#213;","&uacute;","&#152;","&#214;","&ucirc;","&#153;","&#215;","&yacute;","&#154;","&#216;","&thorn;","&#155;","&#217;","&yuml;","&#156;","&#218;","&amp;","&lt;","&gt;"];

		for(var x=0; x<chars.length; x++){
			if(inverse){
				str = str.replace(new RegExp(chars[x],"g"), codes[x]);
			}else{
				str = str.replace(new RegExp(codes[x],"g"), chars[x]);
			}
		}

		return str;
	},

	changeBuildingMode: function(selected) {
        	
    	var $canvas = Application.utils.getCanvas();
		var arrayMqClass = ['display-mobile', 'show-img-device','hidden-device','element-block-center','mobile-margin','full-width'];	

		$canvas.trigger('changeBuildingMode', [ selected ] );
        
    	$.each( arrayMqClass, function( key, name ){
		if ( selected == 'mobile') {
        		$('.' + name).addClass('st-js-' + name);
		} else {
        		$('.' + name).removeClass('st-js-' + name);
		}
    	});	

    },

    validateHexVal: function(hexVal){
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexVal);
    },

	isAmpScript: function(string){
		if( !Application.globals.enableAmpscript ){
			return false;
		}

		if( string.search(/(%%=v)|(=%%)/g) >= 0 ){
			return true;
		}
		return false;
	}
}
