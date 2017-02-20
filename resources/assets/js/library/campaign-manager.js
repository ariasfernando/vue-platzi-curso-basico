/*
 *  -- CAMPAIGN MANAGER ---
 */
var campaignManager = {
    campaignId: null,
    plainText: null,
    htmlCode: null,
    lockInterval: 30000,
    cleanOptions: {
        // Array of classes to clean from final html
        classSelectors: [
            "text-overlay",
            "prevent-overflow",
            "text-editable-2",
            "text-editable-0",
            "mce-edit-focus",
            "mce-content-body"
        ],
        // Array of attributes to clean from final html
        attrSelectors: [
            "data-params",
            "data-modal",
            "data-open-element-config",
            "data-master-image-editor",
            "data-master-button-editor",
            "data-image-library",
            "data-medium-element",
            "data-placeholder",
            "contenteditable",
            "spellcheck",
            "aria-multiline",
            "role",
            "truncate",
            "singleline",
            "data-mce-bogus",
            "data-key",
            "data-mce-href",
            "data-mce-style",
            "id"
        ]
    },

    getCampaignId: function(){
        if( this.campaignId != null ){
            return this.campaignId;
        }

        var campaignId = 0;
        var $form = Application.utils.getConfigurationForm();

        if( $form.find("input[name=campaign_id]").length ){
            campaignId = $form.find("input[name=campaign_id]").val();
        }

        return campaignId;
    },

    /*
     *  -- Do Save --
     *  @param draft (bool) | default: true
     *  Get data, validate configuration form, return ajax request.
     */
    save: function( params ){

        var options = $.extend({
            saveHtml: false,
            validateModules: false,
            validateForms: true,
            doTransform: false
        }, params );

        var data = {};

        // Get Campaign configuration.
        data = this.getConfiguration();

        // Store Campaign Id
        if( data.campaign_id ){
            this.campaignId = data.campaign_id;
        }

        if(options.template){
            data.template = options.template;
        }
        
        // Check if have plain text
        if( this.plainText != '' && this.plainText != null ){
            data.plain_text = this.plainText;
        }

        // Validate configuration form (required fields)
        if ( options.validateForms === true ) {
            $.each( $(".menu-campaign form"), function( index, form ){
                if( !Application.utils.validate.validateForm( form ) ){
                    // Show configuration module if has error an is collapsed
                    if( $(form).is(":hidden") ){
                        $(form).parents(".configuration-mod").find("> h2").click();
                    }
                }
            });

            if( $(".menu-campaign .error").length ){
                return false;
            }
        }

        // Get modules data
        data.modules_data = this.getModulesParams();

        // Save html if is requested.
        if( options.saveHtml === true ){
            data.body_html = this.getCleanedHtml({ doTransform: options.doTransform });
        }

        // ToDo: Validate modules data.

        if( options.validateModules === true ){
            // Remove validation classes
            $(".st-validation-error").removeClass("st-validation-error");
            $(".default-image-error").removeClass("default-image-error");

            var errorFound = false;

            // Validate Modules
            var moduleRows = Application.utils.getCanvas().find("tr[data-params]");
            if( moduleRows.length ){
                $.each( moduleRows, function(index, moduleElement ){
                    var moduleData = $(moduleElement).data('params');

                    // Validate data params
                    if( moduleData && moduleData.data_validation && moduleData.data_validation.length ){
                        $.each( moduleData.data_validation, function( dataIndex, dataKey ){
                            if( !moduleData.data[dataKey] || moduleData.data[dataKey] == "" ){
                                $(moduleElement).addClass("st-validation-error");
                                errorFound = true;
                            }
                        });
                    }

                    // Validate image height
                    if( moduleData && moduleData.validate_image_height && $(moduleElement).find("img").length ){
                        var height = $(moduleElement).find("img").eq(0).height();
                        $.each($(moduleElement).find("img"),function(index,image){
                            if(height != $(image).height()){
                                $(moduleElement).addClass("st-validation-error");
                                errorFound = true;
                            }
                        });
                    }
                });
            }

            // Validate if all links are filled.
            var linksToValidate = Application.utils.getCanvas().find(".st-validate-href");

            if( linksToValidate.length ){
                $.each( linksToValidate, function(index, element){
                    var $element = $(element);
                    var isButton = $element.hasClass('st-cta-button');
                    var textNode = $.trim($element.text());
                    var linkUrl = $element.attr("href").trim();
                    var linkError = false;

                    // $element is a linked text and doesn't validate
                    if ( !isButton && textNode && !Application.utils.validate.validateUrlFormat(linkUrl) ) {
                        linkError = true;
                    }

                    // $element is a linked button and doesn't validate
                    if ( isButton && !Application.utils.validate.validateUrlFormat(linkUrl) ) {
                        linkError = true;
                    }

                    // Display error message and attach error class to $element
                    if ( linkError ) {
                        if( $element.hasClass("st-error-on-parent") ){
                            $element.parents("tr[data-params]").find("table:first-child").addClass("st-validation-error");
                        }else{
                            $element.addClass("st-validation-error");
                        }

                        errorFound = true;
                    }
                });
            }

            // Check if all images are uploaded.
            var nonEditedImages = Application.utils.getCanvas().find("img[src*='/default/']");

            if( nonEditedImages.length ){
                $.each( nonEditedImages, function(index, img){
                    $(img).parent().addClass("default-image-error");
                });

                errorFound = true;
            }

            var errors = Application.utils.getCanvas().find(".error");

            if( errors.length ){
                errorFound = true;
            }

            if( errorFound ){
                return false;
            }
        }

        // If no campaign data, default value is set
        if (data.campaign_name == '') {
            data.campaign_name = 'Untitled Campaign';
        }
        
        // Return Ajax Request
        return Application.utils.doAjax("/campaign/save", {data: data});
    },

    /*
     * Process campaign
     */
    process: function( fnDone, fnFail ){
        var campaignId = this.getCampaignId();
        var processCampaignRequest = Application.utils.doAjax("/campaign/process", {data: { campaign_id: campaignId }});

        processCampaignRequest.done(function( response ){
            if( fnDone ){
                fnDone( response );
            }
        });
        processCampaignRequest.fail(function(){
            if( fnFail ){
                fnFail();
            }
        });
    },

    // Get campaign configuration.
    // Serialize form and return [obj,obj,obj...].
    getConfiguration: function(){
        // Get form
        var $form = Application.utils.getConfigurationForm();
        var result = {};

        if( $form ){
            // Serialize Form
            var fields = $form.serializeArray();

            // Push fields to results.
            $.each( fields, function( index, field){
                result[ field.name ] = field.value;
            });
        }

        return result;
    },

    // Make array with params of each module in the canvas
    getModulesParams: function(){
        var result = [];
        // Get canvas.
        var $canvas = Application.utils.getCanvas();

        if( $canvas ){
            // Find each module row from canvas.
            var rows = $canvas.find("> tr");
            $.each( rows, function( index, module){
                result.push( $(module).data("params") );
            });
        }
        
        // Return data Object
        return result;
    },

    // Transform modal content into a given string, and
    // replace marks like [key] with module data
    doTransform: function( $cleanedHtml ){
        function parseTransformValue( valueStr, moduleData ){
            var result = valueStr;
            var matches = valueStr.match(/\[[a-z_]+\]/);

            if(matches){
                for( var i=0; i<matches.length; i++){
                    result = result.replace( matches[i], moduleData[ matches[i].substring(1, matches[i].length-1) ] );
                }
            }

            return result;
        }

        if( this.beforeTransform ){
            $cleanedHtml = this.beforeTransform( $cleanedHtml );
        }

        var modules = $cleanedHtml.find("tr[data-params]");

        $.each( modules, function( index, module ){
            var dataParams = $(module).data("params");

            if( dataParams.transform ){
                var transformParams = "\n" + parseTransformValue( dataParams.transform , dataParams.data ) + "\n";

                $(module).after(transformParams);
                $(module).remove();
            }
        });

        return $cleanedHtml;
    },

    getCleanedHtml: function( params ){

        var options = $.extend({
            doTransform: true
        }, params );

        var $canvas = null;
        var $cleanedHtml = null;
        // Get Canvas
        $canvas = Application.utils.getCanvas();
        if( !$canvas.find("> tr").length ){
            return false;
        }

        // Clone content
        $cleanedHtml = $canvas.clone( true );


        // Add tracking params
        $cleanedHtml = this.addTrackingParams($cleanedHtml);

        // Apply transform
        if( options.doTransform ){
            $cleanedHtml = this.doTransform($cleanedHtml);
        }

        // Set height and width on images.
        $.each( $cleanedHtml.find("img"), function( index, image){
            // Check if the image have height or width attribute
            if( !$(image).attr("width") && !$(image).attr("height") ){
                var $moduleRow = $(image).parents("tr[data-params]");
                var dataParams = $moduleRow.data("params");
                var imageKey = "image" + $moduleRow.find("a img").index( image );

                // If the module have image size params.
                if( dataParams.image_size && dataParams.image_size[imageKey] ){
                    var heightRatio = image.height / dataParams.image_size[imageKey].height;
                    var widthRatio = image.width / dataParams.image_size[imageKey].width;

                    // If ratio is greater than 1 the image size is greater to.
                    if( heightRatio > 1 || widthRatio > 1 ){
                        // Set fixed height
                        if( heightRatio >= widthRatio ){
                            $(image).attr("height",dataParams.image_size[imageKey].height);
                        }else{
                            $(image).attr("width",dataParams.image_size[imageKey].width);
                        }
                    }
                }
            }
        });

        // Remove attr tags function clean
        var $removeAttr = this.removeDataHtml($cleanedHtml,this.cleanOptions.attrSelectors,"attr");
        // Function removeDataHtml fail attributes
        if( $removeAttr != false ){
            $cleanedHtml = $removeAttr;
        }

        // Remove class tags
        var $removeClass = this.removeDataHtml($cleanedHtml,this.cleanOptions.classSelectors,"class");
        // Function removeDataHtml fail attributes
        if( $removeClass != false ){
            $cleanedHtml = $removeClass;
        }

        // Remove every element with class st-remove-element
        $cleanedHtml.find("[class^=st-remove-element]").remove();

        // Remove every class starting with "st-"
        $cleanedHtml.find("[class*=' st-'], [class^='st-']").removeClass(function (index, css) {
            return (css.match (/(^|\s)st-\S+/g) || []).join(' ');
        });

        // Remove attr class if it's empty.
        $cleanedHtml.find("[class='']").removeAttr("class");

        // Remove attr style if it's empty.
        $cleanedHtml.find("[style='']").removeAttr("style");

        // Remove tooltip
        $cleanedHtml.find(".actions-buttons-tooltip").remove();

        // Remove toolbox Tinymce
        $cleanedHtml.find(".text-overlay-toolbox").remove();

        // Convert data-contenteditable-href to href
        if ($cleanedHtml.find('[data-contenteditable-href]').length){
            var $targetContenteditableHref = $cleanedHtml.find('[data-contenteditable-href]');

            $.each( $targetContenteditableHref, function( key, element ){
                var tempDataContenteditableHref = $( element ).data('contenteditable-href');
                // Add href
                $( element ).attr('href',tempDataContenteditableHref);
                // Remove data-contenteditable-href 
                $( element ).removeAttr('data-contenteditable-href'); 
            });
        }

        // Convert special chars to html entities ---
        $cleanedHtml = Application.utils.encodeHtmlEntities( $cleanedHtml );

        return Application.utils.charConvert( $cleanedHtml.html() );
    },

        // display plain text modal.
    removeDataHtml: function( $html, list, type ){
        if( !$html ){
            return false;
        }

        var $editedHtml = $html;

        // Remove data tags
        for( var i=0; i < list.length; i++ ){
            switch( type ){
                case "class":
                    $editedHtml.find("."+list[i]).removeClass(list[i]);
                    break;
                case "attr":
                    $editedHtml.find("["+list[i]+"]").removeAttr(list[i]);
                    break;
            }
        }

        return $editedHtml;
    },

    // display plain text modal.
    getPlainText: function( fnDone, fnFail ){
        var campaignId = this.getCampaignId();
        // first get plain text
        var getPlainTextRequest = Application.utils.doAjax("/campaign/plain-text", { type: "GET", data:{ campaign_id: campaignId }});
        // Done callback
        getPlainTextRequest.done(function( response ){
            if( fnDone ){
                fnDone( response );
            }
        });
        // Fail callback
        getPlainTextRequest.fail(function(){
            if( fnFail ){
                fnFail();
            }
        });
    },

    // display plain text modal.
    getHtmlCode: function( fnDone, fnFail ){
        var campaignId = this.getCampaignId();
        // first get plain text
        var getPlainTextRequest = Application.utils.doAjax("/campaign/html", { type: "GET", data:{ campaign_id: campaignId }});
        // Done callback
        getPlainTextRequest.done(function( response ){
            if( fnDone ){
                fnDone( response );
            }
        });
        // Fail callback
        getPlainTextRequest.fail(function(){
            if( fnFail ){
                fnFail();
            }
        });
    },

    sendPreviewEmail: function( email, fnDone, fnFail, fnAlways ){
        if( !email ){
            return false;
        }

        var campaignId = this.getCampaignId();
        var sendPreviewRequest = Application.utils.doAjax("/campaign/send-preview", {
            type: "POST",
            data:{
                campaign_id: campaignId,
                mail: email
            }
        });

        sendPreviewRequest.done(function( response ){
            if( fnDone ){
                fnDone(response);
            }
        });

        sendPreviewRequest.fail(function(){
            if( fnFail ){
                fnFail();
            }
        });

        sendPreviewRequest.always(function(){
            if( fnAlways ){
                fnAlways();
            }
        });
    },

    initLockPing: function(){
        campaignManager.lock();
        setInterval("campaignManager.lock()", this.lockInterval );
    },

    confirmFinishedCampaignEdition: function(){
        var $finishedModal = $("#modal-campaign-finished");
        var processedValue = parseInt($("#campaign_process").val());
        if(processedValue !== 0){
            $finishedModal.modal();
        }
    },

    lock: function(){
        var response = Application.utils.doAjax("/campaign/lock", {
            data:{
                campaign_id: this.getCampaignId()
            }
        });
        response.fail(function(){
            var confirmModal = new Application.utils.confirm({
                message: 'Connection or session lost, please go back to login',
                confirmModalId: "modal-confirm",
                noCancel: true,
                onSubmit: function(){
                    window.location.href = Application.globals.baseUrl + "/";
                },
                onClose: function(){
                    window.location.href = Application.globals.baseUrl + "/";
                }
            });
            confirmModal.display();

        });
    },

    addTrackingParams: function(html){
        var boxCounter = 1;
        var rows = html.find("> tr");
        var dateSubmitted = $.datepicker.formatDate('yy-mm-dd', new Date());
        $.each( rows, function( index, module){
            var params = $(module).data("params");
            if (typeof params.tracking != 'undefined') 
            {
                var boxes = $(module).find(".st-box");
                $.each( boxes, function( index, box){

                    var links = $(box).find("a");
                    $.each( links, function( index, link){
                        if ($(link).hasClass('st-no-tracking') === false) 
                        {
                            var separator = link.href.indexOf('?') !== -1 ? "&" : "?";
                            link.href = link.href + separator + params.tracking.params + params.tracking.placement + boxCounter;
                        }
                    });

                    boxCounter ++;
                    });

                var links = $(module).find("a");
                $.each( links, function( index, link){
                    if (link.href.indexOf("cmp") < 0 && $(link).hasClass('st-no-tracking') === false)
                    {
                        var separator = link.href.indexOf('?') !== -1 ? "&" : "?";
                        link.href = link.href + separator + params.tracking.params + params.tracking.placement;
                    }
                });
            }

            var links = $(module).find("a");
            $.each( links, function( index, link){
                var linkHref = $(link).attr("href");
                if( linkHref && linkHref != "" ){
                $(link).attr("href",linkHref.replace('[DATE-SUBMITTED]',dateSubmitted));
                }
            });

        });

        return html;
    },

    processHtml: function(){
        var spinner = new Application.utils.spinner();
        var _this = this;

        spinner.text("Processing campaign...");
        spinner.show();

        _this.process(
            // Success callback
            function( response ){
                // get job id from response.
                if( response.job ){
                    // Ping process status
                    Application.utils.processQueue.getJobStatus( response.job, function(){
                            // When job is finished, get html code.
                            _this.showHtmlCode();
                        },
                        function() {
                            // Hide Spinner
                            spinner.hide();
            // Display Error Alert
                            Application.utils.alert.display("Error:","An error occurred while processing the campaign, please try again later.","danger");
                        });
                }else if( response.processed ){
                    _this.showHtmlCode();
                }
            },
            // Fail callback
            function(){
                // Hide Spinner
                spinner.hide();
                // Display Error Alert
                Application.utils.alert.display("Error:","An error occurred while trying to get the data, please try again later.","danger");
        }
        );
    },

    processPlainText: function(){
        var spinner = new Application.utils.spinner();
        var _this = this;

        spinner.text("Generating plain text...");
        spinner.show();

                _this.getPlainText(
                    // Done callback
                    function(  plainText  ){
                        _this.plainText = plainText;
                        // Hide Spinner
                        spinner.hide();
                        // Show plaintext
                        _this.showPlainTextModal( plainText );
                    },
                    // Fail callback
                    function(){
                        // Hide Spinner
                        spinner.hide();
                        // Display Error Alert
                        Application.utils.alert.display("Error:","An error occurred while trying to get the data, please try again later.","danger");
                    }
                );
    },

    startProcessCampaign: function(){
        var spinner = new Application.utils.spinner();
        var _this = this;

        // To start we must save campaign
        var saveCampaign = _this.save({
            saveHtml: true,
            validateModules: true,
            doTransform: true
        });

        // If validation is invalid return false
        if( !saveCampaign ){
            // Display Error Alert
            Application.utils.alert.display("",Application.globals.campaignValidationError,"danger");
            return false;
        }
        // Save campaign Request: On success
        saveCampaign.done(function( campaignId ){
            if( campaignId ){
                // Set campaign ID
                _this.campaignId = campaignId;

                if(Application.globals.processPlainText) {
                    // Do get plain text request
                    _this.processPlainText();
                }else{
                    // Process Campaign.
                    _this.processHtml();
                }
            }else{
                // Hide Spinner
                spinner.hide();
                // Display Error Alert
                Application.utils.alert.display("Error:","An error occurred while trying to save, please try again later.","danger");
            }
        });

        // Save campaign fail
        saveCampaign.fail(function(){
            // Hide Spinner
            spinner.hide();
            // Display Error Alert
            Application.utils.alert.display("Error:","An error occurred while trying to save, please try again later.","danger");
        });
    },

    showPlainTextModal: function( plainText ){
        var _this = this;
        var spinner = new Application.utils.spinner();
        // Get plain text modal from DOM.
        var $plainTextModal = $("#modal-plain-text");

        if( $plainTextModal ){
            // Append plain text in modal
            $plainTextModal.find(".modal-body textarea").empty().append( plainText );
            // Set submit click
            $plainTextModal.find(".btn-submit").unbind();
            // Set onSubmit event

            $plainTextModal.find(".btn-submit").bind( "click", function(){
                $plainTextModal.modal("hide");
                // Show spinner
                spinner.show("Saving plain text.");

                // Update plain text.
                _this.plainText = $plainTextModal.find(".modal-body textarea").val();

                // Save campaign again include plain text.
                var saveCampaign = _this.save({
                    saveHtml: true,
                    doTransform: true
                });

                saveCampaign.done(function( campaignId ){
                    if( campaignId ){
                        // Process Campaign.
                        _this.processHtml();
                    }
                });

                // Save campaign fail
                saveCampaign.fail(function(){
                    // Hide Spinner
                    spinner.hide();
                    // Display Error Alert
                    Application.utils.alert.display("Error:","An error occurred while trying to save, please try again later.","danger");
                });

            });
            // Show modal
            $plainTextModal.modal();
        }
    },

    showHtmlCode: function(){
        var _this = this;
        var spinner = new Application.utils.spinner();

        spinner.text("Getting html code.");
        // Get HTML code.
        _this.getHtmlCode(
            function( html ){
                // Hide Spinner
                spinner.hide();
                // Show campaign processed modal.
                var $campaignProcessedModal = $("#modal-campaign-processed");
                if( $campaignProcessedModal ){
                    _this.htmlCode = html;
                    $campaignProcessedModal.find(".modal-body textarea").empty().text( html );
                    $campaignProcessedModal.modal();
                }
            },
            function(){
                // Hide Spinner
                spinner.hide();
                // Display Error Alert
                Application.utils.alert.display("Error:","An error occurred while trying to get the HTML, please try again later.","danger");
            }
        );
    },
    /*
     * == Add a new Tag ==
     * This function add a new tag label.
     */
    addTag: function(tagValue){
        // Get inputs
        var $tagEntry = $('#campaignConfiguration input[name=tag_entry]');
        var $campaignTags = $('#campaignConfiguration input[name=tags]');

        // Check if tag already exist
        var campaignTags = JSON.parse($campaignTags.val());
        if (campaignTags.indexOf(tagValue) === -1) {
            // Push into tag values
            campaignTags.push(tagValue);
            // Build and append tag label
            var $labelTag = $('<span class="st-tag">'+tagValue+' <span class="remove-tag" data-tag="'+tagValue+'"><i class="fa fa-times"></i></span></span>');
            $('#campaignConfiguration #tags-box').append($labelTag);
        }
        // Update tag values
        $campaignTags.val(JSON.stringify(campaignTags));
    },
    initTagEntry: function() {
        var $tagEntryField = $('#campaignConfiguration input[name=tag_entry]');
        if( $tagEntryField.data("autocomplete") ){
            $tagEntryField.autocomplete({
                source: $tagEntryField.data("autocomplete"),
                select: function(event,ui){
                    campaignManager.addTag(ui.item.value);
                    $tagEntryField.autocomplete("close");
                    this.value = "";
                    return false;
                }
            });
        }

        $('#campaignConfiguration')
            // Prevent paste
            .on("paste","input[name=tag_entry]",function(event){
                event.preventDefault();
                return false;
            })
            .on("keydown","input[name=tag_entry]",function(e){
                var finalCode = e.keyCode || e.charCode || e.which;
                if (finalCode == 13) {
                    // Prevent empty tags
                    if( this.value.trim() == "" ){
                        return false;
                    }
                    var tagValue = this.value;
                    campaignManager.addTag(tagValue);
                    this.value = '';
                }

                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(finalCode, [46, 8, 9, 27, 110]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (finalCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    // Allow: home, end, left, right, down, up
                    (finalCode >= 35 && finalCode <= 40)){
                    // let it happen, don't do anything
                    return;
                }


                if (e.altKey || e.key == "Dead" || e.key.search(/[^a-zA-Z0-9-_]/g) != -1) {
                    e.preventDefault();
                    return false;
                }
            })
            .on("drag drop","input[name=tag_entry]",function(e){
                e.preventDefault();
                return false;
            })  
            // Remove selected tag.
            .on("click",".st-tag .remove-tag",function(event){
                event.preventDefault();
                var $tagsField = $('#campaignConfiguration input[name=tags]');
                var campaignTags = JSON.parse($tagsField.val());
                var tagindex = campaignTags.indexOf($(this).data('tag'));
                campaignTags.splice(tagindex, 1);
                $tagsField.val(JSON.stringify(campaignTags));
                $(this).parent().remove();
            });
    },
    saveAsTemplate: function(fnDone, fnFail){
        var saveCampaign = this.save({ template: true });

        if (!saveCampaign) {
            if( typeof fnFail == "function" ){
                fnFail();
            }
            return false;
        }

        saveCampaign.done(function() {
            Application.utils.alert.display('', 'This email template was saved successfully.', 'success');

            if( typeof fnDone == "function" ){
                fnDone();
            }
        });

        saveCampaign.fail(function() {
            Application.utils.alert.display('Error:', 'An error occurred while trying to save, please try again later.', 'danger');

            if( typeof fnFail == "function" ){
                fnFail();
            }
        });
    },
    forceLock: function(fnDone, fnFail) {
        var config = this.getConfiguration();
        var data = {
            campaign_id: config.campaign_id
        };
        var lockCampaign = Application.utils.doAjax('/campaign/force-lock', {data: data});

        lockCampaign.done(function(data) {
            Application.utils.alert.display('', 'This campaign is locked now. Only you can unlock it.', 'success');
            if(typeof fnDone === 'function') {
                fnDone();
            }
        });
        lockCampaign.fail(function(data) {
            Application.utils.alert.display('Error:', 'An error occurred while trying to lock it, please try again later.', 'danger');
            if (typeof fnFail === 'function') {
                fnFail();
            }
        });
    },
    unlockForced: function(fnDone, fnFail) {
        var config = this.getConfiguration();
        var data = {
            campaign_id: config.campaign_id
        };
        var unlockCampaign = Application.utils.doAjax('/campaign/unlock-forced', {data: data});
        unlockCampaign.done(function(data) {
            Application.utils.alert.display('', 'This campaign is unlocked now, and you can make changes on it', 'success');
            if (typeof fnDone === 'function') {
                fnDone();
            }
        });
        unlockCampaign.fail(function(data) {
            Application.utils.alert.display('Error:', 'An error occurred while trying to unlocked, please try again later.', 'danger');
            if (typeof fnFail === 'function') {
                fnFail();
            }
        });
    }
};
