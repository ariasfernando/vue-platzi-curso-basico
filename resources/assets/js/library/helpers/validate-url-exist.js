(function ( $ ) {
    Application = Application || {};
    Application.helpers = Application.helpers || {};

    /**
     * Checks if the given url exist.
     * Returns a promise
    **/
    Application.helpers.validateUrlExist = function(params) {
        if( !params.$target || !params.$target.length ){
            return false;
        }

        /*
         * === Options ===
         * $target: could be input text or form. 
         */
        var options = $.extend({},{
            // fieldSelector: used to get fields to validate when $target is a <form>
            fieldSelector: ".url-format",
            // messages
            messages: {},
            // onProcess: called before start
            onProcess: function(){},
            // onFinish: called at the end of all validations.
            onFinish: function(resultsArr){},
            // onSuccess: called at the end of each validation if was successfull.
            onSuccess: function(field){},
            // onSuccess: called at the end of each validation if an error ocurred.
            onError: function(field){}
        },params);

        /*
         * === Messages ===
         * Default messages
         */
        var messages = $.extend({},{
            urlDoesnExist: "URL does not appear to exist.",
            ajaxError: "An error occurred while trying to validate URL.",
            processing: "Verifying if the given url exists...",
            urlExist: "The url exists."
        },options.messages);

        /*
         * === requestsArr ===
         * It's filled with each request
         */
        var requestsArr = [];

        /*
         * === elementsArr ===
         * It's filled with each field to validate.
         */
        var elementsArr = [];

        /*
         * === resultsArr ===
         * It's filled with each validation result.
         */
        var resultsArr = [];

        /*
         * === Get validation request ===
         * Recibes url to validate and return ajaxRequest.
         */
        var getValidationRequest = function( url ){
            return Application.utils.doAjax("/api/validate-url",{
                data: {
                    url: url
                }
            });
        };

        /*
         * === Do form validation ===
         * Call doFieldValidation for each url field into form.
         * Use the param fieldSelector to get each field to validate.
         */
        var doFormValidation = function(){
            var $form = options.$target;
            if( $form.find(options.fieldSelector).length ){
                $.each($form.find(options.fieldSelector),function(index,element){
                    doFieldValidation(element);
                });
            }
        };

        /*
         * === Do field validation ===
         * Get validation request and push to requestaArr and elementsArr.
         */
        var doFieldValidation = function( field ){
            
            if(!field){
                return false;
            }

            // Check if field has validation params.
            // Proceed field only if format validation return true.
            if(!formatValidation(field) || field.value == "" ){
                return false;
            }
            // Check if url was validated and get validation object
            var validationObj = urlWasValidated( field );
            
            // If url was not validated
            if( !validationObj.wasValidated ){
                startProcess( field );
                requestsArr.push( getValidationRequest(field.value) );
                elementsArr.push( field );
            
            // If url was validated before
            }else{
                resetFieldStatus( field );
                // If url exist show success message
                if( validationObj.isValid ){
                    resetFieldStatus(field);
                    showSuccessOnField(field);
                // If url doesn' exist show error message
                }else{
                    showErrorOnField(field,messages.urlDoesnExist);
                }
            }
        };

        /*
         * === Format validation ===
         * Uses to check if the field has data validate params.
           If it has validation url, do validation and return result.
         */
        var formatValidation = function(field){
            if(!field){
                return false;
            }

            var fieldValidationData = $(field).data("validation");
            var validation_exist = true

            
            if(fieldValidationData && fieldValidationData.required && (fieldValidationData.required === true || fieldValidationData.required === "true")){
                // Set the result of the validation
                if(!Application.utils.validate.validateRequiredField( field )){
                    validation_exist = false;
                }
            }

            if( fieldValidationData && fieldValidationData.url ){
                if(!Application.utils.validate.validateUrlField( field )){
                    validation_exist = false;
                }
            }
            return validation_exist;
        };

        /*
         * === URL was validated ===
         * Check if an url was validated before.
         * Returns an object.
         */
        var urlWasValidated = function( field ){
            var data = $(field).data("url-validated") || [];
            var currentUrl = $(field).val();
            var result = {
                wasValidated: false,
                isValid: false
            };

            $.each(data,function(index,validation){
                if( validation.url == currentUrl ){
                    result.wasValidated = true;
                    result.isValid = validation.isValid;
                }
            });

            return result;
        };

        /*
         * === Reset field status ===
         * Clean classes and messages. 
         */
        var resetFieldStatus = function( field ){
            Application.utils.validate.initField(field);
        };

        /*
         * === Show error on field ===
         * Display error message and set error class.
         */
        var showErrorOnField = function( field, errorMsg ){
            resetFieldStatus(field);
            Application.utils.validate.setMessage(field,errorMsg,"warning");
        };

        /*
         * === Show success message on field ===
         * Display success message and set success class.
         */
        var showSuccessOnField = function( field, msg ){
            if(!msg){
                msg = messages.urlExist;
            }

            resetFieldStatus(field);
            Application.utils.validate.setMessage(field, msg, "success");
        };

        /*
         * === Start Process ===
         * Called on the beginning of validation to reset input,
           make it disabled and display processing message
         */
        var startProcess = function( field ){
            resetFieldStatus(field);
            $(field).attr("disabled","disabled");
            Application.utils.validate.setMessage(field,messages.processing,"warning");
        };

        /*
         * === Process url validation response ===
         * @response (ajaxRespnse) 
         * @index (number) index of request in requestsArr
         */
        var processResponse = function( response, index ){
            if(!index){
                index = 0;
            }

            var field = elementsArr[index];
            
            if( response[1] == "success" ){
                var result = response[0].is_valid;
                // if url exist
                if(result){
                    resetFieldStatus(elementsArr[index]);
                    showSuccessOnField(field);
                    if( typeof options.onSuccess == "function" ){
                        options.onSuccess(field);
                    }
                // if url doesn't exist
                }else{
                    showErrorOnField(field,messages.urlDoesnExist);
                    if( typeof options.onError == "function" ){
                        options.onError(field,messages.urlDoesnExist);
                    }
                }

                // Save validation data into field data.
                saveUrlValidation(field,result);
                // Add validation result to resultsArr
                resultsArr[index] = {
                    url: field.value,
                    isValid: result
                }
            }else{
                // Show warning message
                showErrorOnField(field,messages.ajaxError);
                options.onError(field,messages.ajaxError);
            }
        };

        /*
         * === Save Url validation ===
         * Save url and result on field data under key url-validated.
         * Used to prevent validate a url which has been validated.
         */
        var saveUrlValidation = function(field, isValid){
            if(!field){
                return false;
            }

            var data = $(field).data("url-validated") || [];
            data.push({
                url: field.value,
                isValid: isValid   
            });

            $(field).data("url-validated",data);
        };

        /*
         * === The magic starts here ===
         */
        if( typeof options.onProcess == "function" ){
            options.onProcess();
        }

        // Check if $target is a form or an input text
        if( options.$target.is("form") ){
            doFormValidation();
        }else if( options.$target.is("input") ){
            doFieldValidation(options.$target[0]);
        }else{
            return false;
        }

        // If requestsArr has elements process responses.
        if( requestsArr.length ){
            $.when.apply(null, requestsArr).done(function() {
                if( requestsArr.length > 1 ){
                    $.each(arguments,function(index,response){
                        processResponse( response, index );
                    });
                }else{
                    processResponse( arguments );
                }

                if( typeof options.onFinish == "function" ){
                    options.onFinish(resultsArr);
                }
            });

        // If not then call on finish function.
        }else{
            if( typeof options.onFinish == "function" ){
                options.onFinish(resultsArr);
            }
        }
    };

})(jQuery);