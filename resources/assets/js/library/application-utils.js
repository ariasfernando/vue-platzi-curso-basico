var Application = Application || {};

Application.utils = {
    /*
     *  Alerts
     */
    alert: {
        // Use it to set timeout function and close alerts after x seconds.
        timeOut: null,
        errorBox: Application.globals.errorPlaceholder,
        /*
         *  Display alerts
         *  Type: info(default), success, warning, danger
         */
        display: function( title, message, type ){
            if( !title && !message ) {
                return false
            }

            if (Application.utils.alert.timeOut != null) {
                clearTimeout( Application.utils.alert.timeOut );
            }

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
                    text += '<strong>' + title.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</strong> ';
                }
                if( message != "" ){
                    text += message.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
                    if(!window.location.pathname == "/admin/user") {
                        // Hide Alert after 8 seconds
                    Application.utils.alert.timeOut = setTimeout(function(){
                        if( $errorBox.is(":visible") ){
                            $errorBox.slideUp("slow");
                        }
                    }, 8000);
                    }
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
            onClose: function(){},
            onEscape: function(){}
        };

        this.confirmOptions = $.extend( this.defaultConfig, options );

        this.display = function(){
            var confirm = this;
            var $confirmModal = $("#"+confirm.confirmOptions.confirmModalId);

            // Remove all attached events from submit button.
            $confirmModal.find(".btn-submit").unbind();

            // Set text
            $confirmModal.find(".modal-body").text( confirm.confirmOptions.message );
            $confirmModal.find(".btn-submit").text( confirm.confirmOptions.labels.submitBtn );
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

            // Set on escape key press
            $confirmModal.keydown(function(e) {
                 if (e.keyCode == 27) {
                    confirm.confirmOptions.onEscape();
                }
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
     *  -- Button Spinner --
     */
    buttonSpinner: function() {
        this.show = function( elem ) {
            $(elem).addClass("ajax-loader-small").attr("disabled","disabled");
        }

        this.hide = function( elem ) {
            $(elem).removeClass("ajax-loader-small").removeAttr("disabled");
        }
    },

    /*
     *  -- Modal Spinner --
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
     *  -- Form Validations --
     */
    validate: {
        form: null,
        // Default Messages.
        messages: {
            required: {
                default: "Please, complete this field.",
                file: "Please, select a file."
            },
            email: "Please, enter a valid email address.",
            compareTo: "The field not match.",
            minLength: "The field minimum size is [min].",
            maxLength: "The best practice is to limit preheaders to 50 characters.",
            url: "Please, enter a valid URL.",
            invalidFileType: "Please, upload a valid file.",
            invalidFileSize: "The file exceeds the size limit.",
            validateUrl: {
                error: "The destination for this URL does not appear to exist. Please doublecheck the link. If this is expected, please ignore.",
                success: "The URL exists.",
                fail: "The system cannot validate if the URL exists. Please, try again.",
                verifying: "Verifying if the given URL exists..."
            }
        },
        // Validate if a field is filled.
        validateRequiredField: function( field ){
            var result = false;
            var $field = $(field);

            if ($field.prop('tagName') === 'SELECT' && $field.hasClass('selectpicker')) {
                // This validates required on a select multiple
                result = ( $field.val() !== null && $field.val().length > 0 );
            } else {
            switch( $field.attr("type") ){
                case "checkbox":
                    break;
                case "radio":
                    break;
                    default:
                        result = ( $field.val().trim() != "");
                }
            }

            return result;
        },
        validateEmailFormat: function( field ){
            var emails = field.value.split(";").filter(Boolean)
            var re = /^(([\w-\+]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/i;

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
            $(field)
                .removeClass("error warning success")
                .removeAttr("disabled");

            var $labelMessage = $(field).next("label");
            if( $labelMessage.hasClass("error") || $labelMessage.hasClass("success") || $labelMessage.hasClass("warning") ){
                $labelMessage.remove();
            }

            if ($(field).hasClass('selectpicker')) {
                $(field).next('button').removeClass('error').next("label.error").remove();
            }

            if( $(field).hasClass("warning") ){
                $(field).removeClass("warning");
                $(field).next("label.warning").remove();
            }

        },
        setError: function( field, message ){
            var label = '<label class="error">' + message + '</label>';
            $(field).parent().find('label.error').remove();
            if ($(field).hasClass('selectpicker') || $(field).hasClass('skip-next-on-error')) {
                $(field).addClass('error').next().after(label);
                $(field).next('button').addClass('error');
            } else {
                $(field).addClass('error').after(label);
            }
        },
        setWarning: function( field, message ){
            $(field).addClass("warning").after('<label class="warning">'+message+'</label>');
            Application.utils.validate.setMessage(field, message);
        },
        setMessage: function( field, message, type ){
            if(!type){
                type = "error";
            }
            $(field).addClass(type).after('<label class="'+type+'">'+message+'</label>');
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
                validationResult.success = validate.validateCompareField( field, $(validate.form).find('input[name="'+validationParams.compareTo+'"]') );

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

            // MAX LENGTH: check the filed max length.
            if( validationParams.maxLength && validationResult.success != false ){
                // Set the result of the validation
                validationResult.success = (field.value.length <= validationParams.maxLength );

                // If isn't successful, set the error messages.
                if( !validationResult.success ){
                    validationResult.message = validate.messages.maxLength;
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

            validate.form = form;

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
        getJobStatus: function( jobId, callback, failCallback, run ){

            if( !jobId ) {
                return false;
            }

            // if undefined means this if the first run
            if (typeof run === 'undefined') {
                run = 1;
            }

            // Do ajax to get process status.
            var ajaxRequest = Application.utils.doAjax("/queue/status/process/" + jobId, { type: "GET" });

            // On ajax Done
            ajaxRequest.done(function( response ){
                // If status isn't finished
                if ( response.status == "started" || response.status == "queued" ){
                    // Check again in 1 second.
                    setTimeout(function(){
                        Application.utils.processQueue.getJobStatus(jobId, callback, failCallback, 1);
                    }, 1000);

                } else if (response.status == "finished") {
                    callback();
                } else {

                    if (run <= 3) {
                        // Check again in run * 700
                        setTimeout(function(){
                            Application.utils.processQueue.getJobStatus(jobId, callback, failCallback, ++run);
                        }, run * 700);
                    } else {
                        failCallback();
                    }
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

        var chars = {
            "©": "&copy;",
            "Û": "&#219;",
            "®": "&reg;",
            "ž": "&#158;",
            "Ü": "&#220;",
            "Ÿ": "&#159;",
            "Ý": "&#221;",
            "$": "&#36;",
            "Þ": "&#222;",
            "%": "&#37;",
            "¡": "&#161;",
            "ß": "&#223;",
            "¢": "&#162;",
            "à": "&#224;",
            "£": "&#163;",
            "á": "&#225;",
            "À": "&Agrave;",
            "¤": "&#164;",
            "â": "&#226;",
            "Á": "&Aacute;",
            "¥": "&#165;",
            "ã": "&#227;",
            "Â": "&Acirc;",
            "¦": "&#166;",
            "ä": "&#228;",
            "Ã": "&Atilde;",
            "§": "&#167;",
            "å": "&#229;",
            "Ä": "&Auml;",
            "¨": "&#168;",
            "æ": "&#230;",
            "Å": "&Aring;",
            "©": "&#169;",
            "ç": "&#231;",
            "Æ": "&AElig;",
            "ª": "&#170;",
            "è": "&#232;",
            "Ç": "&Ccedil;",
            "«": "&#171;",
            "é": "&#233;",
            "È": "&Egrave;",
            "¬": "&#172;",
            "ê": "&#234;",
            "É": "&Eacute;",
            "­": "&#173;",
            "ë": "&#235;",
            "Ê": "&Ecirc;",
            "ì": "&#236;",
            "Ë": "&Euml;",
            "¯": "&#175;",
            "í": "&#237;",
            "Ì": "&Igrave;",
            "°": "&#176;",
            "î": "&#238;",
            "Í": "&Iacute;",
            "±": "&#177;",
            "ï": "&#239;",
            "Î": "&Icirc;",
            "²": "&#178;",
            "ð": "&#240;",
            "Ï": "&Iuml;",
            "³": "&#179;",
            "ñ": "&#241;",
            "Ð": "&ETH;",
            "´": "&#180;",
            "ò": "&#242;",
            "Ñ": "&Ntilde;",
            "µ": "&#181;",
            "ó": "&#243;",
            "Õ": "&Otilde;",
            "¶": "&#182;",
            "ô": "&#244;",
            "Ö": "&Ouml;",
            "·": "&#183;",
            "õ": "&#245;",
            "Ø": "&Oslash;",
            "¸": "&#184;",
            "ö": "&#246;",
            "Ù": "&Ugrave;",
            "¹": "&#185;",
            "÷": "&#247;",
            "Ú": "&Uacute;",
            "º": "&#186;",
            "ø": "&#248;",
            "Û": "&Ucirc;",
            "»": "&#187;",
            "ù": "&#249;",
            "Ü": "&Uuml;",
            "@": "&#64;",
            "¼": "&#188;",
            "ú": "&#250;",
            "Ý": "&Yacute;",
            "½": "&#189;",
            "û": "&#251;",
            "Þ": "&THORN;",
            "€": "&#128;",
            "¾": "&#190;",
            "ü": "&#252",
            "ß": "&szlig;",
            "¿": "&#191;",
            "ý": "&#253;",
            "à": "&agrave;",
            "‚": "&#130;",
            "À": "&#192;",
            "þ": "&#254;",
            "á": "&aacute;",
            "ƒ": "&#131;",
            "Á": "&#193;",
            "ÿ": "&#255;",
            "å": "&aring;",
            "„": "&#132;",
            "Â": "&#194;",
            "æ": "&aelig;",
            "…": "&#133;",
            "Ã": "&#195;",
            "ç": "&ccedil;",
            "†": "&#134;",
            "Ä": "&#196;",
            "è": "&egrave;",
            "‡": "&#135;",
            "Å": "&#197;",
            "é": "&eacute;",
            "ˆ": "&#136;",
            "Æ": "&#198;",
            "ê": "&ecirc;",
            "‰": "&#137;",
            "Ç": "&#199;",
            "ë": "&euml;",
            "Š": "&#138;",
            "È": "&#200;",
            "ì": "&igrave;",
            "‹": "&#139;",
            "É": "&#201;",
            "í": "&iacute;",
            "Œ": "&#140;",
            "Ê": "&#202;",
            "î": "&icirc;",
            "Ë": "&#203;",
            "ï": "&iuml;",
            "Ž": "&#142;",
            "Ì": "&#204;",
            "ð": "&eth;",
            "Í": "&#205;",
            "ñ": "&ntilde;",
            "Î": "&#206;",
            "ò": "&ograve;",
            "‘": "&#145;",
            "Ï": "&#207;",
            "ó": "&oacute;",
            "’": "&#146;",
            "Ð": "&#208;",
            "ô": "&ocirc;",
            "“": "&#147;",
            "Ñ": "&#209;",
            "õ": "&otilde;",
            "”": "&#148;",
            "Ò": "&#210;",
            "ö": "&ouml;",
            "•": "&#149;",
            "Ó": "&#211;",
            "ø": "&oslash;",
            "–": "&#150;",
            "Ô": "&#212;",
            "ù": "&ugrave;",
            "—": "&#151;",
            "Õ": "&#213;",
            "ú": "&uacute;",
            "˜": "&#152;",
            "Ö": "&#214;",
            "û": "&ucirc;",
            "™": "&trade;",
            "×": "&#215;",
            "ý": "&yacute;",
            "š": "&#154;",
            "Ø": "&#216;",
            "þ": "&thorn;",
            "›": "&#155;",
            "Ù": "&#217;",
            "ÿ": "&yuml;",
            "œ": "&#156;",
            "Ú": "&#218;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '£': '&pound;',
            "℠": "&#x2120;"
        }

        $.each(chars, function(key, value){
            if(inverse){
                str = str.replace(new RegExp(key,"g"), value);
            }else{
                str = str.replace(new RegExp(value,"g"), key);
            }
        });

        return str;
    },

    encodeHtmlEntities: function($cleanedHtml) {
        var all = $cleanedHtml.find("p, span, div, h1, h2, h3, h4, h5, a, td");

        $.map(all, function(el, index) {
            var textConnvert =  Application.utils.charConvertHtmlEntities($(el).html());
            if(el.innerText.length > 0) {
                $(el).text(textConnvert);
            }
        });

        return $cleanedHtml;
    },

    charConvertHtmlEntities: function(str) {
        var codesToChars = {
            '&amp;':'&#38;',
            '&nbsp;':'&#160;',
            '&':'&#38;',
            ';':'&#59;',
            '\\?':'&#63;',
            '=':'&#61;',
            ':':'&#58;',
            '•':'&#8226;',
            ',':'&#44;',
            '"':'&quot;',
            '’':'&rsquo;',
            '‘':'&lsquo;',
            '”':'&rdquo;',
            '“':'&ldquo;',
            '←':'&larr;',
            '→':'&rarr;',
            '↑':'&uarr;',
            '↓':'&darr;',
            '–':'&#8211;',
            '—':'&#8212;',
            '»':'&#187;',
            '£':'&#163;',
            '©':'&#169;',
            '®':'&#174;',
            '℠':'&#8480;',
            '™':'&#8482;'
        };

        var codesToCharsTags = {
            "&quot;":"'",
            "&#039;":"'"
        }

        var rex     = new RegExp('(<[^>]*>)|(&[a-zA-Z0-9#]+;)', "gm");
        var re      = new RegExp(Object.keys(codesToChars).join("|"),"gi");
        var reTags  = new RegExp(Object.keys(codesToCharsTags).join("|"),"gi");
        var parts   = str.split(rex);
        var res     = '';

        for (var i = 0; i < parts.length; i++) {
            if (typeof parts[i] !== 'undefined') {
                //only text
                if ($.inArray(parts[i].charAt(0), ['<', '&']) < 0) {
                    parts[i] = parts[i].replace(re, function(matched) {
                        return matched === '?' ? '&#63;' : codesToChars[matched];
                    });
                }
                //tags
                else {
                    parts[i] = parts[i].replace(reTags, function(matched) {
                        return codesToCharsTags[matched];
                    });
                }
                res = res + parts[i];
            }
        }

        return res;
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

    componentFromStr: function (numStr, percent) {
        var num = Math.max(0, parseInt(numStr, 10));
        return percent ?
            Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
    },

    /* Convert RGB to Hexa */

    rgbToHex: function (rgb) {
        var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
        var result, r, g, b, hex = "";
        if ((result = rgbRegex.exec(rgb))) {
            r = Application.utils.componentFromStr(result[1], result[2]);
            g = Application.utils.componentFromStr(result[3], result[4]);
            b = Application.utils.componentFromStr(result[5], result[6]);

            hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        return hex;
    },

    replaceRgbWithHex: function ($cleanedHtml) {
        var all = $cleanedHtml.find('*');
        var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
        $.map(all, function (el, index) {
            //Check if the color property is set, and if it's rgb.
            if (el.style.color && el.style.color.indexOf('#') === -1 || el.style.backgroundColor && el.style.backgroundColor.indexOf('#') === -1) {
                if (rgbRegex.test(el.style.color) || rgbRegex.test(el.style.backgroundColor)) {
                    var rgb_style = $(el).attr('style');
                    //Update style attr
                    $(el)
                        .attr('style',
                            rgb_style
                            .replace(
                                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                                function ($0, $1, $2, $3) {
                                    return "#" + ("0" + Number($1).toString(16)).substr(-2) + ("0" + Number($2).toString(16)).substr(-2) + ("0" + Number($3).toString(16)).substr(-2);
                                })
                        )
                }
            }
        });
        return $cleanedHtml;
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
    },

    notifications: function() {

        function create(params) {

            var defaultParams = {
                theme: 'stensul',
                layout: 'topRight',
                text: '',
                animation: {
                    open: { height: 'toggle' },
                    close: { height: 'toggle' },
                    easing: 'swing',
                    speed: 500,
                    killer: false
                },
                onShow: function() {},
                afterShow: function() {},
                onClose: function() {},
                afterClose: function() {},
                onCloseClick: function() {}
            };

            var params = $.extend(defaultParams, params);

            return noty(params);
        }

        function get(id) {
            $.noty.get(id);
        }

        function show(id) {
            $.noty.get(id);
        }

        function close(id) {
            $.noty.close(id);
        }

        function closeAll () {
            $.noty.closeAll();
        }

        return {
            create: create,
            show: show,
            close: close,
            closeAll: closeAll
       };
    },

    htmlSubstr: function (str, count) {

        var div = document.createElement('div');
        div.innerHTML = str;

        walk(div, track);

        function track(el) {
            if (count > 0) {
                var len = el.data.length;
                count -= len;
                if (count <= 0) {
                    el.data = el.substringData(0, el.data.length + count);
                }
            } else {
                el.data = '';
            }
        }

        function walk(el, fn) {
            var node = el.firstChild;
            do {
                if (node.nodeType === 3) {
                    fn(node);
                } else if (node.nodeType === 1 && node.childNodes && node.childNodes[0]) {
                    walk(node, fn);
                }
            } while (node = node.nextSibling);
        }

        return div.innerHTML;
    },

    isTooDark: function(hexVal, tolerance) {
        var tolerance = tolerance || 40;
        var c = hexVal.substring(1); // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

        if(luma < tolerance){
            return true;
        }

        return false;
    },

    preheaderWarning: function (el) {
        Application.utils.validate.initField(el);
        if ( $(el).val().length > 0 ){
            var validationResult = Application.utils.validate.validateField(el);
            if(!validationResult.success) {
                Application.utils.validate.setWarning(el,validationResult.message);
            }
        }
    },

    /**
     * Returns an Object representation of the styles from the given String
     * @param {string} css
     * @example Application.utils.cssToObj(jqueryObject.attr('style'))
     * @returns {object}
     */
    cssToObj: function (css) {
        if(css.length === 0) {
            return {};
        }
        var obj = {}, s = css.replace(/-(.)/g, function (m, g) {
            return "-"+g.toLowerCase();
        }).replace(/;\s?$/g,"").split(/:|;/g);
        for (var i = 0; i < s.length; i += 2)
            obj[s[i].replace(/\s/g,"")] = s[i+1].replace(/^\s+|\s+$/g,"");
        return obj;
    },

    /**
     * Returns a String representation of the styles from the given Object
     * @param {object} obj
     * @example Application.utils.objToCss($.extend(returnedCssToObj, { 'width': '10px' }))
     * @returns {string}
     */
    objToCss: function(obj) {
        var keys = Object.keys(obj)
        if (!keys.length) return ''
        var i, len = keys.length
        var result = ''
        for (i = 0; i < len; i++) {
            var key = keys[i]
            var val = obj[key]
            result += key + ': ' + val + ';'
        }
        return result;
    },

    isJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },

    // Remove wrappers element ( .stx-wrapper & .stx-wrapper-comment)
    removeWrappers: function(html) {
        function removeContainersWrappers(htmlContainers) {
            var $wrapperElementRemove = htmlContainers.find('.stx-wrapper');
            $.each($wrapperElementRemove, function(i, element) {
                var $element = $(element);

                // Replace element with the content element.
                if ($element.is('table')) {
                    $element.replaceWith($element.find('td:first').html());
                } else {
                    $element.replaceWith($element.html());
                }
            });
            if (htmlContainers.find('.stx-wrapper').length > 0) {
                removeContainersWrappers(htmlContainers);
            }
            return htmlContainers;
        }
        function removeCommentWrappers(htmlComment) {
            var $commentElementRemove = htmlComment.find('.stx-wrapper-comment');
            if ($commentElementRemove.length > 0) {
                    $.each($commentElementRemove, function(i, element) {
                        $(element).replaceWith($(element).html());
                    })
            }
            return htmlComment;
        }
        // We need first replace comment and then replace the divs that have tables.
        // if else Jquery some times change the place of the comment.
        html = removeCommentWrappers(html)
        html = removeContainersWrappers(html)
      return html;
    },
};
