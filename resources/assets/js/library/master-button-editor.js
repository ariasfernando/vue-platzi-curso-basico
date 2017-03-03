/*
 | Master Button Editor.
 | Required: imageManager, moduleManager, campaignManager.
 */

var masterButtonEditor = function( customOptions ){
    var lineLimit = Application.helpers.lineLimit;

    var $modalContent = null;
    var moduleData = {};

    var editorOptions = $.extend({
        title: "Button editor",
        buttonCssClass: "",
        availableLabels: [],
        buttonDefaultLabel: "Primary Button",
        buttonArrowImage: "images/modules/arrow-rightx2.png"
    }, customOptions );

    var _this = this;

    /*
     * This function return the key of the target into data params (button0, button1, button2, etc).
     * Is used to save in data params or to get saved data in module.
     */
    var getDataKey = function(){
        if( moduleManager.modalTarget ){
            var $module = $(moduleManager.modalTarget).parents("[data-params]");
            return "button"+ $( $module.find("[data-master-button-editor]") ).index( moduleManager.modalTarget );
        }

        return false;
    };

    var getButtonData = function(){
        var dataKey = getDataKey();
        var data = {};

        if( dataKey ){
            var dataParams = $(moduleManager.modalTarget).parents("[data-params]").data("params");
            if( dataParams.data[dataKey] ){
                data = dataParams.data[dataKey];
            }
        }

        return data;
    };

    var validateLineLimit = function() {

        if ( !editorOptions.line_limit ) {
            return true;
        }

        var button = $modalContent.find(".master-button")[0];
        var isValid = true;

        if ( Application.helpers.limitLines(button, false) ) {
            $modalContent.find(".alert").slideUp();
        } else {
            $modalContent.find(".alert").slideDown();
            isValid = false;
    }

        return isValid;
    };

    /*
     * This function init the editor.
     * Here we initialize functionality, set events and configs.
     */
    var init = function( $content ){
        // Set Submit
        $content.on("click",".submit-config",function(){
            _this.submit();
            return false;
        });

        // Set button class
        if( editorOptions.buttonCssClass != "" ){
            $modalContent.find(".master-button").addClass( editorOptions.buttonCssClass );
        }

        buttonData = getButtonData();

        // Set default label or saved label
        if( buttonData.label ){
            $modalContent.find(".button-label").val( buttonData.label );
            $modalContent.find(".master-button span").text( buttonData.label );
        }else if( editorOptions.buttonDefaultLabel ){
            $modalContent.find(".master-button span").text( editorOptions.buttonDefaultLabel );
        }

        // Set saved link url
        if( buttonData.link ){
            $modalContent.find(".button-link-url").val( buttonData.link );
        }

        // Init Autocomplete
        if( editorOptions.availableLabels.length ){
            $modalContent.find(".button-label").attr('placeholder','Press down arrow to display preloaded labels.');
            $modalContent.find(".button-label").autocomplete({
                minLength: 0,
                source: editorOptions.availableLabels
            });
            // Change button preview text
            $modalContent.on("autocompleteselect", ".button-label", function(event, ui){
                $modalContent.find(".button-editor-display .master-button span").text( ui.item.label );
            });
        }

        // Change button preview text
        $modalContent.on("keyup change input", ".button-label", function(){
            if( $(this).val() == '' ){
                $modalContent.find(".button-editor-display .master-button span").text( editorOptions.buttonDefaultLabel );
            }else{
                $modalContent.find(".button-editor-display .master-button span").text( $(this).val() );
            }
        });
    };

    /*
     * Save data and update DOM
     */
    this.save = function(){
        var $module = $(moduleManager.modalTarget).parents("[data-params]");

        // Get data from fields
        buttonData.link = $modalContent.find(".button-link-url").val();

        // Save data in data-paramas
        moduleManager.saveInData( $module, getDataKey(), buttonData );

        // Set data into module.
        $(moduleManager.modalTarget).attr("href", buttonData.link);
        $(moduleManager.modalTarget).find("img" ).attr("src", Application.globals.campaignImageUrl + buttonData.path);
    };

    /*
     * Submit edition
     */
    this.submit = function(){
        if( Application.utils.validate.validateForm( $modalContent.find("form")[0] && validateLineLimit() )){
            _this.setStatus("busy");
            var dataKey = getDataKey();
            //  Check if should generate canvas.
            var generateCanvas = false;

            if( buttonData && buttonData.label != $modalContent.find(".button-label").val() ){
                generateCanvas = true;
                buttonData.label = $modalContent.find(".button-label").val();
            }

            if( !generateCanvas ){
                _this.save();
                $.magnificPopup.close();
            }else{
                imageManager.generateCanvas( $modalContent.find(".button-editor-display .master-button"), function(canvas){
                    // save url data canvas and complete input hidden data_image.
                    var urlImageData = canvas.toDataURL("image/png");

                    var ajaxData = {
                        data_image: urlImageData,
                        campaign_id: campaignManager.getCampaignId()
                    };

                    // Upload Edited image.
                    imageManager.uploadImage(
                        ajaxData,
                        // Done
                        function( response ){
                            buttonData = {
                                'path': response.path,
                                'label': buttonData.label
                            };

                            // Save in data and update dom.
                            _this.save();

                            // Close Popup
                            $.magnificPopup.close();
                        },
                        // Fail
                        function(){
                            // Hide Spinner
                            _this.setStatus("default");
                        }
                    );
                }, 2); // Scale ratio 2
            }
        }
    };

    /*
     *  Set Status
     */
    this.setStatus = function( status ){
        switch( status ){
            case 'busy':
                $modalContent.find(".submit-config").addClass("disabled");
                $modalContent.find(".submit-config").after('<img src="'+Application.globals.imageUrl+'ajax-loader.gif" class="spinner-small pull-right"/>');
            break;
            default:
                $modalContent.find(".submit-config").removeClass("disabled");
                $modalContent.find(".spinner-small").remove();
            break;
        }
    };

    /*
     *  Close magnific popup
     */
    this.closeModal = function(){
        $.magnificPopup.close();
    }

    /*
     *  Open magnific popup by ajax and init editor when ajax content are added
     */
    this.openModal = function(){

        editorOptions.app_name = "base";
        editorOptions.name = "master_button_editor";

        $.magnificPopup.open({
            type: 'ajax',
            closeOnBgClick: false, //-> closeOnBgClick: prevent close on background click.
            items: {
                src: Application.globals.baseUrl + "/template/modal",
            },
            ajax: {
                settings: {
                    type: "POST",
                    cache: true,
                    dataType: "html",
                    async: true,
                    // Send option to template
                    data: editorOptions
                }
            },
            callbacks: {
                beforeOpen: function() {  this.wrap.removeAttr('tabindex') },
                ajaxContentAdded: function() {
                    // Ajax content is loaded and appended to DOM
                    $modalContent = this.content;
                    init( this.content );
                }
            }
        });
    };
}
