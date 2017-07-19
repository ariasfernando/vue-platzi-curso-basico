/*
 | ======================
 | API Library
 | Dependencies: jQuery
 | ======================
 */

var Application = Application || {};

Application.api = function(){

    var options = {
        domSelector: document,
        modalSelector: "#modal-campaign-upload",
        modalLoginSelector: "#modal-campaign-api-login",
        btnUploadSelector: ".btn-upload-api",
        btnModalUploadSelector: ".btn-upload-submit",
        uploadApiForm : ".upload-api-form",
        campaignId : ".campaign_id",
        campaignIdData : "campaign-id",
        apiDriver : "api-driver",
        dataTable : ".uploaded-data",
        useOauthSelector : "input[name='use_oauth']",
        accessToken: "input[name='access_token']"
    };

    var initialized = false;

    var oauthResponse = false;

    this.openUpload = function(elem){
        var _this = this;
        var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
        $campaignUploadModal.find( options.campaignId ).val( $(elem).attr( 'data-' + options.campaignIdData ) );
        $campaignUploadModal.find('.response-message').hide();
        $campaignUploadModal.find('.filename').val('');
        $campaignUploadModal.find(options.dataTable).hide();
        _this.updateModalTable(elem);
        if( $campaignUploadModal ){
            $campaignUploadModal.modal();
        }
    };

    this.uploadEmail = function(elem){
        var _this = this;
        var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
        var $uploadForm = $campaignUploadModal.find(options.uploadApiForm);
        $campaignUploadModal.find('.response-message').hide();
        if( Application.utils.validate.validateForm( $uploadForm[0] ) ){
            $( elem ).addClass("ajax-loader-small").attr("disabled","disabled");
            $( elem ).parent().removeClass("success").addClass("spinner");

            var useOauth = $campaignUploadModal.find(options.useOauthSelector).val();

            if (useOauth && _this.checkOauth( elem )) {
                _this.openOauthModal( elem );
                return false;
            }

            var data = $uploadForm.serialize();
            var processCampaignUpload = Application.utils.doAjax("/api/upload-email", {data: data});

            processCampaignUpload.done(function( response ){
                if (response.status == 'success') {
                    $('.response-message-success').show();
                    _this.updateModalTable(elem);
                    $uploadForm.find('#filename').val('');
                    if (typeof $vm !== 'undefined') {
                        $vm.$children[0].fetchCampaigns('finished');
                    }
                } else {
                    if (useOauth) {
                        _this.openOauthModal( elem );
                    }
                }
            });

            processCampaignUpload.fail(function(error){
                if (error.status == 409) {
                    $('.response-message-error-duplicated').show();
                } else {
                    $('.response-message-error').show();
                }
            });

            processCampaignUpload.always(function(){
                $( elem ).parent().removeClass("spinner");
                $( elem ).removeClass("ajax-loader-small").removeAttr("disabled","disabled");
            });
        }
        return false;
    };

    this.oauthCallback = function(data){
        var _this = this;
        _this.oauthResponse = true;
        if (typeof data.access_token != 'undefined') {
            $( options.uploadApiForm + ' ' + options.accessToken ).val(data.access_token);
            _this.uploadEmail($( options.modalSelector + '-' + $(options.btnModalUploadSelector).attr( 'data-' + options.apiDriver) + ' ' + options.btnModalUploadSelector ));
        }
    };

    this.updateModalTable = function(elem){
        var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
        var campaign_id = $campaignUploadModal.find( options.campaignId ).val();
        var data = { campaign_id: campaign_id };
        var getHistory = Application.utils.doAjax("/api/history", { type: "GET", data: data });
        getHistory.done(function( response ){
            var table = $campaignUploadModal.find( options.dataTable );
            if (response.length) {
                var tableContent = '';
                var dataInfo = $campaignUploadModal.find(options.dataTable).attr('data-info') || 'filename';

                for (var i = response.length - 1; i >= 0; i--) {
                    if( i == (response.length - 1)) {
                        for (var key in response[i]) {
                            if ($(options.modalSelector + " ." + key).length && key != 'campaign_id' && response[i][key]) {
                                var fieldContent = (key=='filename')? response[i]['original_filename'] : response[i][key];
                                $(options.modalSelector + " ." + key).val(fieldContent);
                            }
                        }
                    }

                    tableContent += ''
                    + '<tr>'
                    +	'<td>' + response[i].date + '</td>'
                    +	'<td>' + response[i][dataInfo] + '</td>'
                    +	'<td>' + response[i].user + '</td>'
                    + '</tr>';
                }
                table.find('tbody').html(tableContent);
                table.fadeIn();
            }else{
                $campaignUploadModal.find(" input[type='text']").each(function(){
                   $(this).val('');
                });
                table.hide();
            }
        });
    };

    this.checkOauth = function( elem ){
        var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
        var $accessToken = $campaignUploadModal.find( options.uploadApiForm + ' ' + options.accessToken );
        return ( $accessToken.val().length == 0 );
    };

    this.openOauthModal = function( elem ){
        this.oauthResponse = false;
        var popup = window.open( Application.globals.baseUrl + '/api/oauth', 'login_popup',
            'height=700,width=800,status=0,location=0,toolbar=0,top=50,left=200');

        setTimeout(function () {
            if (!popup || popup.outerHeight === 0) {
                var $campaignUploadModal = $( options.modalSelector + '-' + $(elem).attr( 'data-' + options.apiDriver) );
                $campaignUploadModal.find('.response-message-popup')
                    .html("Popup Blocker detected. Please add this site to your exceptions list and reload this page.")
                    .slideDown();
                setTimeout(function() {
                    $campaignUploadModal.find('.response-message-popup').slideUp();
                }, 6000);
            }
        }, 500);

        var timer = setInterval(function() {
            if (popup.closed) {
                clearInterval(timer);
                if (!_this.oauthResponse) {
                    $( elem ).parent().removeClass("spinner");
                    $( elem ).removeClass("ajax-loader-small").removeAttr("disabled","disabled");
                }
            }
        }, 200);

        return false;
    };

    this.init = function(){

        var _this = this;

        if (!_this.initialized) {

            // -- Show upload modal --
            $(document).on("click", options.btnUploadSelector , function(){
                _this.openUpload( this );
                return false;
            });

            // -- Upload email to api --
            $(document).on("click", options.btnModalUploadSelector, function(){
                _this.uploadEmail( this );
                return false;
            });

            _this.initialized = true;

        }
    };

    this.init();

};
